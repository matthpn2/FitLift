/*
    ACCELEROMETER ORIENTATIONS:
    ---------------------------
    Bicep Curls ( R )
    - accelerometer on RIGHTSIDE with INT pin and 10LB sign facing up
     Bicep Curls ( L )
    - accelerometer on LEFTSIDE with INT pin and 10LB sign facing up

    Lateral Raises ( R & L )
    - accelerometer on backside ( behind ) with INT and 10LB pin facing up

    Tricep Extensions ( R & L )
    - accelerometer facing down with INT pin facing backside ( behind )

    Single Front Raises 
    - accelerometer facing down with INT pin point away from user ( front )
*/

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <Wire.h>

// ESP-8266 pin outs
#define D1 5        // I2C bus SCL ( clock )
#define D2 4        // I2C bus SDA ( data )
#define D5 14       // pushbutton with 1K pulldown resistor
#define D6 12       // green LED
#define D7 13       // orange LED
#define D8 15       // blue LED

// network information
const char * ssid = "ENTER_NETWORK_HERE";
const char * password = "ENTER_PASSWORD_HERE";

// firebase database information
const char * host = "https://fitlift-38a0c.firebaseio.com";
const char * firebaseAPIKey = "AIzaSyAOFwsIxlQSaONcrlNFKRKDp5W-Ug_QSuY";

// fitLIFT Heroku information 
String fitliftHerokuUrl = "https://fitlift-firebase.herokuapp.com/login";
String fitliftHerokuFingerprint = "08 3B 71 72 02 43 6E CA ED 42 86 93 BA 7E DF 81 C4 BC 62 30";

// fitLIFT user information
String fitLiftUserEmail = "sample_user@gmail.com";
String fitLiftUserPassword = "123456";
String fitLiftUserID;
String fitLiftIdToken;                    // received when user successfully signs into firebase ( authentication purposes )
String postUrl;

// SHA1 fingerprint of the database browser's certificate
// chrome dev tools -> security -> view certificate -> details -> SHA1 fingerprint
String fingerprint = "B8 4F 40 70 0C 63 90 E0 07 E8 7D BD B4 11 D0 4A EA 9C 90 F6";

// timestamp variables
const char * timeHost = "http://api.timezonedb.com";
const char * timeGetUrl = "/v2/get-time-zone?format=json&key=M16RZS5PP1F9&by=zone&zone=America/Los_Angeles";

unsigned long timestamp = 0;              // stores time in seconds ( converted to milliseconds later )
unsigned long timestampOffset = 0;        // GMT offset

// MPU-6050 (accelerometer / gyroscope) variables
int16_t accelX, accelY, accelZ;           // raw data read from accelerometer
float gForceX, gForceY, gForceZ;          // scaled data for readability

int16_t gyroX, gyroY, gyroZ;              // raw data read from gyroscope
float rotX, rotY, rotZ;                   // scaled data for readability

// pushbutton / LED variables
bool connectedToFirebase;                 // green LED:  ON if connected, OFF otherwise

bool canExercise;                         // indicates whether user can exercise OR not
bool currentExerciseState;                // orange LED: ON if user can start exercising, OFF otherwise
bool lastExerciseState;

unsigned long lastToggleTime = 0;         // last time exercise pushbutton was toggled ON/OFF
unsigned long exerciseDebounce = 100;     // minimum time pushbutton has to be held to register as successful toggle

byte exercisesToBlink;                    // blue LED: keeps track of how many more exercises in queue are left to blink
byte blinkOn;                             // blue LED: ON or OFF

unsigned long lastExerciseBlink;          // last time exercise turned ON/OFF
unsigned long blinkOnDelay = 550;         // minimum time blue LED should be on ( 0.55s )
unsigned blinkOffDelay = 250;             // minimum time blue LED sould be off ( 0.25s )
                                          //    blinkOnDelay + blinkOffDelay must equal exerciseDelay ( 0.8s )

// arduino time variables
unsigned long lastTime;
unsigned long currentTime;
unsigned long lastRecordedTime;

unsigned long printDelay = 250;           // 0.25 second delay for printing
unsigned long exerciseDelay = 800;        // 0.8 second delay before NEXT same exercise registered
unsigned long exerciseStopDelay = 5000;   // 5.0 seconds to halt after NO exercise registered

// exercise algorithm storage variables
int rep_count = 0;
float previousX = 0.0;
float previousZ = 0.0;
String exercise = "null";                 // current exercise in motion

void setup() 
{
    Serial.begin(115200);                       // serial connection

    // LED setup
    pinMode(D5, INPUT);
    pinMode(D6, OUTPUT);
    pinMode(D7, OUTPUT);
    pinMode(D8, OUTPUT);

    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);

    connectedToFirebase = false;
    canExercise = false;
    currentExerciseState = LOW;
    lastExerciseState = LOW;
    exercisesToBlink = 0;
    blinkOn = false;
    lastExerciseBlink = millis();

    // wifi network connection
    Serial.println("Connecting to " + String(ssid));
    WiFi.begin(ssid, password);
    
    while(WiFi.status() != WL_CONNECTED)       // wait for WIFI connection completion
    {  
        delay(1000);
        Serial.println("Waiting for connection.");
    }
    Serial.println("Internet Connection successful!\n");

    // login to firebase
    if (firebaseUserLogin()) 
    {
        connectedToFirebase = true; 
        digitalWrite(D6, HIGH);                 // green LED on = successful login to Firebase
    }
    else 
    {
        connectedToFirebase = false;
        Serial.println();
        Serial.println("Cannot use FitLift without user sign in.");
    }
    
    // set time variables
    lastTime = millis();
    lastRecordedTime = lastTime;

    // MPU-6050 setup
    Wire.pins(D2, D1);                            // Wire.pins(SDA, SCL)
    Wire.begin(D2, D1);                           // initialize I2C communication
    setupMPU(); 
}

void loop() 
{
    // don't execute if NOT even connected to Firebase
    if(!connectedToFirebase)
        return;
        
    currentTime = millis();

    // record accelerometer and gyroscope input
    recordAccelRegisters();
    recordGyroRegisters();

    // check exercise state
    checkExerciseState();

    // print accelerometer data
    // if(currentTime >= lastTime + printDelay) 
    // {
    //     lastTime = currentTime;
    //     printData();
    // }

    // turn ON/OFF blue LED whenever successful rep count is detected
    if(exercisesToBlink > 0 && !blinkOn && currentTime >= lastExerciseBlink + blinkOffDelay) 
    {
        digitalWrite(D8, HIGH);
        lastExerciseBlink = currentTime;
        exercisesToBlink--;
        blinkOn = true;
    }
    if (blinkOn && currentTime >= lastExerciseBlink + blinkOnDelay) 
    {
        digitalWrite(D8, LOW);
        lastExerciseBlink = currentTime;
        blinkOn = false;
    }

    if(canExercise)
    {
        if(currentTime >= lastRecordedTime + exerciseDelay)
        {
            // TRICEP EXTENSIONS
            if(rotX <= -50.0 && rotZ <= 10.0)
            {
                // INCREMENT REP COUNT ON SUCCESSFUL MOTION
                if(exercise == "null" || exercise == "Tricep Extensions")
                {
                    rep_count++;
                    lastRecordedTime = currentTime;
                    
                    exercise = "Tricep Extensions";
                    exercisesToBlink++;

                    // previousX = 0.0;
                    // previousZ = 0.0;

                    Serial.print("Current rep count: ");
                    Serial.print(rep_count);
                    Serial.println("    -----TRICEP EXTENSION-----"); 
                }
            }

            // SINGLE FRONT RAISES
            else if(rotX >= 125.0 && rotY <= 25.0 && rotZ <= 25.0 && gForceX <= 0.5 && gForceY <= 0.0 && gForceZ <= 0.0)
            {
                // INCREMENT REP COUNT ON SUCCESSFUL MOTION
                if(exercise == "null" || exercise == "Single Front Raises")
                {
                    rep_count++;
                    lastRecordedTime = currentTime;
                    
                    exercise = "Single Front Raises";
                    exercisesToBlink++;

                    // previousX = 0.0;
                    // previousZ = 0.0;

                    Serial.print("Current rep count: ");
                    Serial.print(rep_count);
                    Serial.println("    -----SINGLE FRONT RAISE-----"); 
                }

                // HANDLES ERRONEOUS SENSOR DETECTIONS
                else if(exercise == "Lateral Raises" && rep_count == 1)
                {
                    // rep_count++;
                    lastRecordedTime = currentTime;

                    exercise = "Single Front Raises";
                    exercisesToBlink++;

                    previousX = 0.0;
                    previousZ = 0.0;

                    Serial.print("Current rep count: ");
                    Serial.print(rep_count);
                    Serial.println("   -----SINGLE FRONT RAISE-----");
                }
            }

            // BICEP CURLS
            else if((rotX <= 0.0 || rotX >= 5.0) && rotZ >= 75.0 && gForceX <= 0.1 && gForceY <= 1.0 && gForceZ <= 0.1)
            {
                // INCREMENT REP COUNT ON SUCCESSFUL MOTION
                if(exercise == "null" || exercise == "Bicep Curls")
                {
                    rep_count++;
                    lastRecordedTime = currentTime;

                    exercise = "Bicep Curls";
                    delay(250);
                    exercisesToBlink++;

                    // previousX = 0.0;
                    // previousZ = 0.0;

                    Serial.print("Current rep count: ");
                    Serial.print(rep_count);
                    Serial.println("   -----BICEP CURL-----");
                }

                // HANDLES ERRONEOUS SENSOR DETECTIONS
                else if((exercise == "Lateral Raises" || exercise == "Tricep Extensions") && rep_count == 1)
                {
                    // rep_count++;
                    lastRecordedTime = currentTime;

                    exercise = "Bicep Curls";
                    // delay(100);
                    exercisesToBlink++;

                    previousX = 0.0;
                    previousZ = 0.0;

                    Serial.print("Current rep count: ");
                    Serial.print(rep_count);
                    Serial.println("   -----BICEP CURL-----");
                }
            }

            // LATERAL RAISES
            else if(previousX <= 0.0 && previousZ >= 50.0 && gForceX <= 0.1 && gForceY <= 0.1 && gForceZ <= 0.1)
            {
                 // INCREMENT REP COUNT ON SUCCESSFUL MOTION
                if(exercise == "null" || exercise == "Lateral Raises")
                {
                    rep_count++;
                    lastRecordedTime = currentTime;

                    exercise = "Lateral Raises";
                    exercisesToBlink++;

                    previousX = 0.0;
                    previousZ = 0.0;

                    Serial.print("Current rep count: ");
                    Serial.print(rep_count);
                    Serial.println("    -----LATERAL RAISE-----");
                }
            }

            // KEEPS TRACK OF PREVIOUS SENSOR DATA FOR LATERAL RAISE DETECTION
            else
            {
                if(exercise == "null" || exercise == "Lateral Raises" || ((exercise == "Bicep Curls" || exercise == "Tricep Extensions") && rep_count == 1))
                {
                    previousX = rotX;
                    previousZ = rotZ; 
                }

                else if((exercise == "Bicep Curls" || exercise == "Tricep Extensions") && rep_count > 1)
                {
                    previousX = 0.0;
                    previousZ = 0.0;
                }
            }
        }

        // EXCEEDS TIMER COUNT, POSTS AND RESETS
        if((currentTime >= lastRecordedTime + exerciseStopDelay) && exercise != "null")
        {
            exerciseComplete();
        }
    }
}

// establish communication with MPU and setup all registers to read data
void setupMPU()
{
    Wire.beginTransmission(0b1101000);       // the I2C address of the MPU ( b1101000/b1101001 for AC0 low/high )
    Wire.write(0x6B);                        // accessing the register 6B ( power management )
    Wire.write(0b00000000);                  // setting the SLEEP register to 0
    Wire.endTransmission();               
  
    Wire.beginTransmission(0b1101000);       // the I2C address of the MPU 
    Wire.write(0x1B);                        // accessing the register 1B ( gyroscope configuration )
    Wire.write(0b00001000);                  // setting the gyro to full scale +/- 500 deg./s 
    Wire.endTransmission(); 
    
    Wire.beginTransmission(0b1101000);       // the I2C address of the MPU 
    Wire.write(0x1C);                        // accessing the register 1C ( accelerometer configuration )
    Wire.write(0b00000000);                  // setting the accel to +/- 2g
    Wire.endTransmission(); 
}

void recordAccelRegisters() 
{
    Wire.beginTransmission(0b1101000);    // the I2C address of the MPU
    Wire.write(0x3B);                     // starting register for accel readings
    Wire.endTransmission();

    Wire.requestFrom(0b1101000,6);        // request accel registers ( 3B - 40 )

    while(Wire.available() < 6);
    accelX = Wire.read() << 8 | Wire.read();  // store first two bytes into accelX
    accelY = Wire.read() << 8 | Wire.read();  // store middle two bytes into accelY
    accelZ = Wire.read() << 8 | Wire.read();  // store last two bytes into accelZ

    processAccelData();
}

// scale raw data from accelerometer for readability
void processAccelData()
{   
    gForceX = accelX / 16384.0;
    gForceY = accelY / 16384.0; 
    gForceZ = accelZ / 16384.0;
}

void recordGyroRegisters() 
{
    Wire.beginTransmission(0b1101000);    // the I2C address of the MPU
    Wire.write(0x43);                     // starting register for gyro readings
    Wire.endTransmission();

    Wire.requestFrom(0b1101000,6);        // request gyro registers ( 43 - 48 )

    while(Wire.available() < 6);
    gyroX = Wire.read() << 8 | Wire.read();  // store first two bytes into accelX
    gyroY = Wire.read() << 8 | Wire.read();  // store middle two bytes into accelY
    gyroZ = Wire.read() << 8 | Wire.read();  // store last two bytes into accelZ

    processGyroData();
}

// scale raw data from gyroscope for readability 
void processGyroData() 
{ 
    rotX = gyroX / 65.5;
    rotY = gyroY / 65.5;
    rotZ = gyroZ / 65.5;
}

void printData() 
{
    Serial.print("Gyro (deg):");
    Serial.print(" X=");
    Serial.print(rotX);
    Serial.print(" Y=");
    Serial.print(rotY);
    Serial.print(" Z=");
    Serial.print(rotZ);
  
    Serial.println();
  
    Serial.print("Accel (g):");
    Serial.print(" X=");
    Serial.print(gForceX);
    Serial.print(" Y=");
    Serial.print(gForceY);
    Serial.print(" Z=");
    Serial.println(gForceZ);
}

// check if user can exercise OR not
void checkExerciseState() 
{
    bool reading = digitalRead(D5);

    if(reading == HIGH && lastExerciseState == LOW && millis() - lastToggleTime >= exerciseDebounce) 
    {
        // toggle exercise state OFF
        if (currentExerciseState == HIGH) 
        {
            canExercise = false;
            currentExerciseState = LOW; 
            exerciseComplete();
        }
        // toggle exercise state ON
        else 
        {
            canExercise = true;
            currentExerciseState = HIGH; 
        }
        lastToggleTime = millis();
    }

    digitalWrite(D7, currentExerciseState);
    lastExerciseState = reading;
}

// called whenever user hasn't exercised for [exerciseStopDelay] seconds OR toggled off manually
void exerciseComplete() 
{
    if(rep_count > 0) 
    {
        Serial.println("Current exercise over, post and reset!");
        postData(exercise, rep_count);
    
        // cascade blink all 3 LEDs to indicate data has been posted
        digitalWrite(D7, LOW);
        digitalWrite(D8, LOW);
        for(int i = 0; i < 3; i++) 
        {
            digitalWrite(D6, HIGH);
            delay(80);
            digitalWrite(D7, HIGH);
            delay(80);
            digitalWrite(D8, HIGH);
            delay(80);

            delay(50);
            digitalWrite(D6, LOW);
            delay(50);
            digitalWrite(D7, LOW);
            delay(50);
            digitalWrite(D8, LOW);
            delay(50);
        }
    }
    
    rep_count = 0;
    exercise = "null";
    previousX = 0.0;
    previousZ = 0.0;

    digitalWrite(D6, HIGH);     // toggle green LED ON ( internet connection good )
    digitalWrite(D8, LOW);      // toggle blue LED OFF

    exercisesToBlink = 0;
    blinkOn = false;
    canExercise = false;
    currentExerciseState = LOW;
    lastExerciseState = LOW;
}

// POST exercise data to FIREBASE database
void postData(String exerciseType, int reps)
{
    // get timestamp from timezone API
    if (WiFi.status() == WL_CONNECTED)              // check wifi connection status
    { 
        HTTPClient http;                            // declare object of class HTTPClient
        int httpCode;

        String payload;
        char JSONmessageBuffer[300];
        StaticJsonBuffer<300> JSONbuffer;

        http.begin(String(timeHost) + String(timeGetUrl));
        httpCode = http.GET();
        payload = http.getString();

        if (httpCode == 200)                        // status = "OK" 
        {
            payload.toCharArray(JSONmessageBuffer, sizeof(JSONmessageBuffer));
            JsonObject& JSONencoderTime = JSONbuffer.parseObject(JSONmessageBuffer);

            timestamp = JSONencoderTime["timestamp"];
            timestampOffset = JSONencoderTime["gmtOffset"];
            timestamp -= timestampOffset;
        }
        else 
        {
            timestamp = 1577865600000;              // set time to January 1, 2020 12:00:00 AM by default, in seconds
        }
        http.end();                                 // close HTTP connection
    }
    else 
    {
        Serial.println("***Error in WiFi connection. Cannot GET timestamp from timezone API***");
    }
  
    // POST exercise data to database
    if (WiFi.status() == WL_CONNECTED)              // check WiFi connection status
    { 
        HTTPClient http;                            // declare object of class HTTPClient
        int httpCode;

        String payload;
        // char JSONmessageBuffer[300];
        // StaticJsonBuffer<300> JSONbuffer;

        String JSONdata = String("{\n") + 
                          String("  \"reps\": ") + String(reps) + String(",\n") +
                          String("  \"timeStamp\": ") + String(timestamp) + String("000,\n") +
                          String("  \"type\": \"") + String(exerciseType) + String("\"\n") +
                          String("}");
        Serial.println(JSONdata);

        http.begin(String(host) + String(postUrl), fingerprint);
        http.addHeader("Content-Type", "application/json");                // specify content-type header

        httpCode = http.POST(JSONdata);
        payload = http.getString();                                        // GET the response payload
        Serial.println(payload);                                           // print request response payload
        
        if (httpCode == 200)                                               // status = "OK" 
        {
            Serial.println("POST request success!\n");
        }
        else 
        {
            Serial.println("***POST request ERROR***");
        }
        http.end();                                                        // close HTTP connection
    }
    else 
    {
        Serial.println("***Error in WiFi connection. Cannot POST data to database***");
    }
}

// login user to firebase and return TRUE if successful, FALSE otherwise
bool firebaseUserLogin() 
{
    Serial.println("Signing into Firebase...");
  
    // login with username/password
    if(WiFi.status() == WL_CONNECTED)           // check WiFi connection status
    { 
        HTTPClient http;                        // declare object of class HTTPClient
        int httpCode;
        String payload;

        String JSONdata = "{\"email\":\"" + String(fitLiftUserEmail) + 
                          "\",\"password\":\"" + String(fitLiftUserPassword) + "\"}";

        http.begin(fitliftHerokuUrl, fitliftHerokuFingerprint);
        http.addHeader("Content-Type", "application/json");                 // specify content-type header

        httpCode = http.POST(JSONdata);
        payload = http.getString();                                         // get the response payload
        http.end();

        if(httpCode == 200)                    // status = "OK"
        {
            String localId = "\"localId\"";
            bool foundLocalId = false;
            bool foundFirstQuote = false;
            int startIndex = 0;
            int endIndex = 0;

            // extract the user ID from the payload response
            for(int i = 0; i <= payload.length() - localId.length(); i++) 
            {
                if(!foundLocalId) 
                {
                    String substr = payload.substring(i, i + localId.length());
                    if (substr.equals(localId)) 
                    {
                        foundLocalId = true;
                        i += localId.length() - 1;
                    }
                }
                else if(foundLocalId && !foundFirstQuote) 
                {
                    if (payload.charAt(i) == '"') 
                    {
                        foundFirstQuote = true;
                        startIndex = i + 1;
                    }
                }
                else 
                {
                    if(payload.charAt(i) == '"') 
                    {
                        endIndex = i;
                        break;
                    }
                }
            }

            // if user ID is found in response, that means user login was successful
            if(foundLocalId) 
            {
                fitLiftUserID = payload.substring(startIndex, endIndex);

                // find ID token now ( authentication )
                String idToken = "\"idToken\"";
                bool foundIdToken = false;
                foundFirstQuote = false;
                startIndex = endIndex;

                // extract the ID token from the payload response
                for(int i = startIndex; i <= payload.length() - idToken.length(); i++) 
                {
                    if(!foundIdToken) 
                    {
                        String substr = payload.substring(i, i + idToken.length());
                        if(substr.equals(idToken)) 
                        {
                            foundIdToken = true;
                            i += localId.length() - 1;
                        }
                    }
                    else if(foundIdToken && !foundFirstQuote) 
                    {
                        if(payload.charAt(i) == '"') 
                        {
                            foundFirstQuote = true;
                            startIndex = i + 1;
                        }
                    }
                    else 
                    {
                        if(payload.charAt(i) == '"') 
                        {
                            endIndex = i;
                            break;
                        }
                    }
                }

                fitLiftIdToken = payload.substring(startIndex, endIndex);
                postUrl = "/new_exercises/" + fitLiftUserID + ".json?auth=" + fitLiftIdToken;
                Serial.println("User login success!\n");

                return true;
            }
            else 
            {
                Serial.println("***ERROR logging into user. Invalid username/password combination.***");
                postUrl = "/new_exercises/UNKNOWN_USER.json";
            }
        }
        else 
        {
            Serial.println("***ERROR connecting to FitLift Herokup app.***");
            postUrl = "/new_exercises/UNKNOWN_USER.json";
        }
    }  

    return false;
}