const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

admin.initializeApp(functions.config().firebase);

exports.deleteNewExercise = functions.database
  .ref('exercises/{user}/{id}').onWrite((event) => {
    const {
      params: {
        id,
        user,
      }
    } = event;
    const { timeStamp } = event.data.val();
    const day = moment(timeStamp).format("MM-DD-YYYY");
    return Promise.all([
      admin.database()
        .ref(`new_exercises/${user}/${id}`)
        .remove(),
      admin.database()
        .ref(`days_exercised/${user}/${day}`)
        .set(true),
    ])
  })