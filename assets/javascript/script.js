// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDuAvnnRPwh7yVJ1gYJNA5_3XX_pU7GGic",
    authDomain: "train-timetable-b777b.firebaseapp.com",
    databaseURL: "https://train-timetable-b777b.firebaseio.com",
    projectId: "train-timetable-b777b",
    storageBucket: "",
    messagingSenderId: "838607606535",
    appId: "1:838607606535:web:e33cfacce204e290"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#submit").on("click", function(e){
    e.preventDefault();

    var name = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#trainFreq").val().trim();

    var train = {
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        freq: freq
    }

    database.ref("/trains").push(train);

    $("#trainName").val();
    $("#destination").val();
    $("#firstTrain").val();
    $("#trainFreq").val();

});

database.ref("/trains").on("child_added", function(snap){
    var sv = snap.val();
    //first train converted time
    var first = moment(sv.firstTrain, "HH:mm").subtract(1, "years");
    console.log(first);
    var diff = moment().diff(moment(first), "m");
    console.log(diff);
    var deltaT = diff % sv.freq;
    console.log(deltaT);
    var arrive = sv.freq - deltaT;
    console.log(arrive);
    var next = moment().add(arrive, "m");
    next = moment(next).format("HH:mm a")
    console.log(next);

    var newRow = $("<tr>").append(
        $("<td>").text(sv.name),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.freq),
        $("<td>").text(next),
        $("<td>").text(arrive),
    );

    $("tbody").append(newRow);

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });