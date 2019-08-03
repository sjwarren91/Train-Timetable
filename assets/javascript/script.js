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

//function to take data in forms and push to firebase as new train object
$("#submit").on("click", function(e) {
    e.preventDefault();

    var name = $("#trainName")
        .val()
        .trim();
    var destination = $("#destination")
        .val()
        .trim();
    var firstTrain = $("#firstTrain")
        .val()
        .trim();
    var freq = $("#trainFreq")
        .val()
        .trim();

    var train = {
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        freq: freq
    };

    database.ref("/trains").push(train);

    //clear the fields in the form
    $("#trainName").val();
    $("#destination").val();
    $("#firstTrain").val();
    $("#trainFreq").val();
});

//function for removing the selected train 
$(document).on("click", ".rmv-button", function() {
    console.log($(this).attr("data"));
    database
        .ref("/trains")
        .child($(this).attr("data"))
        .remove();
});

//function for updating the fields with the calculated times
database.ref("/trains").on(
    "child_added",
    function(snap) {
        var sv = snap.val();
        var key = snap.ref.key;
        var first = moment(sv.firstTrain, "HH:mm").subtract(1, "years");
        var diff = moment().diff(moment(first), "m");
        var deltaT = diff % sv.freq;
        var arrive = sv.freq - deltaT;
        var next = moment().add(arrive, "m");
        next = moment(next).format("HH:mm a");

        var newRow = $("<tr id='" + key + "'>").append(
            $("<td>").text(sv.name),
            $("<td>").text(sv.destination),
            $("<td>").text(sv.freq + " min"),
            $("<td>").text(next),
            $("<td>").text(arrive + " min"),
            $("<td><button class='rmv-button' data='" + key + "'>Remove</button></td>")
        );

        $("tbody").append(newRow);
    },
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }
);

//function for removing the relevant information from the table when a trian is removed
database.ref("/trains").on(
    "child_removed",
    function(snap) {
        $("#" + snap.ref.key).empty();
    },
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }
);

//function for updating the table once every minute with the next arrival and the number of minutes away
function updateTime() {
    //once will pull data from the database once only
    database.ref("/trains").once(
        "value",
        function(data) {
            data.forEach(function(childData) {

                //recalculate the times
                var cd = childData.val();
                var key = childData.key;

                var first = moment(cd.firstTrain, "HH:mm").subtract(1, "years");
                var diff = moment().diff(moment(first), "m");
                var deltaT = diff % cd.freq;
                var arrive = cd.freq - deltaT;
                var next = moment().add(arrive, "m");
                next = moment(next).format("HH:mm a");

                //append new times to the table
                $("#" + key).find("td").eq(3).text(next);
                $("#" + key).find("td").eq(4).text(arrive + " min");
            });
        },
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );
}

$(document).ready(function() {

    //set an interval to call the update time function once every minute
    setInterval(updateTime, 60000);

});
