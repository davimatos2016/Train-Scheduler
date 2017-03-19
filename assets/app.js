// Initialize Firebase
var config = {
    apiKey: "AIzaSyBVjhd19RCfDC0oA56iVdWk75NN0iF0jJE",
    authDomain: "train-time-b8830.firebaseapp.com",
    databaseURL: "https://train-time-b8830.firebaseio.com",
    storageBucket: "train-time-b8830.appspot.com",
    messagingSenderId: "489094912476"
};

firebase.initializeApp(config);

var database = firebase.database();

//Variable to hold database info
var database = firebase.database();

//Variable to hold information from form
var trainName = "";
var destination = "";
var firstTrainTime = "";
var trainFrequency = "";

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    trainName = $("#train-name").val().trim();
    destination = $("#train-destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    trainFrequency = $("#train-frequency").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        trainFrequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.trainFrequency);

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#first-train-time").val("");
    $("#train-frequency").val("");

    // Prevents moving to new page
    return false;
});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());
    console.log(prevChildKey);

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().trainFrequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("LT");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>");

});
