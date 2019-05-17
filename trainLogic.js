// Initialize Firebase
var config = {
  apiKey: "AIzaSyDVUuWLjH8nL78uvZv6jS9FWTZ86a-T4pc",
  authDomain: "traintime-f0abe.firebaseapp.com",
  databaseURL: "https://traintime-f0abe.firebaseio.com",
  projectId: "traintime-f0abe",
  storageBucket: "traintime-f0abe.appspot.com",
  messagingSenderId: "101155907686"
};
firebase.initializeApp(config);

// Created variable to reference the database
var trainDB = firebase.database();

// Capture submit click to add train
$("#add-train-button").on("click", function () {
  // Prevents page refresh
  event.preventDefault();

  // Create object with properties set to input field values
  var trainInfo = {
    name: $("#train-name-input").val().trim(),
    destination: $("#destination-input").val().trim(),
    firstTrain: $("#first-train-input").val().trim(),
    frequency: $("#frequency-input").val().trim(),
  }
  console.log(trainInfo);

  // Checks for all input fields to have values before pushing to database
  if (trainInfo.name.length > 0 &&
    trainInfo.destination.length > 0 &&
    trainInfo.firstTrain.length > 0 &&
    trainInfo.frequency.length > 0) {
    trainDB.ref().push(trainInfo)
  }

  console.log(trainInfo.name);
  console.log(trainInfo.destination);
  console.log(trainInfo.firstTrain);
  console.log(trainInfo.frequency);

});

// The callback function specified will be called for each child in the DB
trainDB.ref().on("child_added", function(snapshot) {
  console.log(snapshot.val());

  // Stores train data
  var trainName = snapshot.val().name;
  var trainDest = snapshot.val().destination;
  var trainFreq = snapshot.val().frequency;
  var trainFirst = snapshot.val().firstTrain;

  var timeArr = trainFirst.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  // If first train is later than the current time, set arrival to the time of the first train
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // Calculate the minutes until arrival
    var timeDiff = moment().diff(trainTime, "minutes");
    var tRemainder = timeDiff % trainFreq;
    tMinutes = trainFreq - tRemainder;
    // Calculates arrival time
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Add each train's data into the table
  $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});