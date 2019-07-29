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
    console.log(firstTrain-1);
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

database.ref("./trains").on("child_added", function(snap){
    var sv = snap.val();
    //first train converted time
    var first = moment(sv.firstTrain).subtract(1, "years");
    var diff = moment().diff(moment(first), "minutes");
    var deltaT = diff % sv.freq;
    var arrive = sv.freq - deltaT;
    var next = moment().add(arrive, "minutes");



})