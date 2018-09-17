# FitLift
A workout tracker application.

### Goal
Our goal was to create "smart" weights that make logging weighlifting easier with the use of an attachable device for exercise detection and a mobile application for viewing exercise records.

### Technical Approach
Our mobile application is built using React Native, a framework for building native apps. First, the user must log in or sign up. The user can confirm an exercise on the Record tab by entering in the correct repetitions and weight. Additionally, the user can view a previous workout by navigating to the Profile tab and selecting the day which they want to view. </br >

Our attachable device consists of an ESP8266 NodeMCU and an MPU-6050 accelerometer/gyroscope. After creating an account on the mobile application, the user must connect the device to the Internet. Once an Internet connection is established, the user can begin their exercise movements. 

### Testing Instructions
1. Download the repo.
2. Make a file called config.h in the wifi example folder with the login credentials of your wifi network.
3. Compile to the board.
4. Open serial monitor and follow the instructions.
