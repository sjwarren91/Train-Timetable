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

    $("#trainName").val();
    $("#destination").val();
    $("#firstTrain").val();
    $("#trainFreq").val();
});

$(document).on("click", ".rmv-button", function() {
    console.log($(this).attr("data"));
    database
        .ref("/trains")
        .child($(this).attr("data"))
        .remove();
});

database.ref("/trains").on(
    "child_added",
    function(snap) {
        var sv = snap.val();

        var key = snap.ref.key;
        //first train converted time
        var first = moment(sv.firstTrain, "HH:mm").subtract(1, "years");

        var diff = moment().diff(moment(first), "m");

        var deltaT = diff % sv.freq;

        var arrive = sv.freq - deltaT;

        var next = moment().add(arrive, "m");
        next = moment(next).format("HH:mm a");

        var newRow = $("<tr id='" + key + "'>").append(
            $("<td>").text(sv.name),
            $("<td>").text(sv.destination),
            $("<td>").text(sv.freq),
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

database.ref("/trains").on(
    "child_removed",
    function(snap) {
        $("#" + snap.ref.key).empty();
        console.log("#" + snap.ref.key);
        console.log(snap.ref.key);
    },
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }
);

function updateTime() {
    database.ref("/trains").once(
        "value",
        function(data) {
            data.forEach(function(childData) {

                var cd = childData.val();
                var key = childData.key;
                console.log(key);

                var first = moment(cd.firstTrain, "HH:mm").subtract(1, "years");
                var diff = moment().diff(moment(first), "m");
                var deltaT = diff % cd.freq;
                var arrive = cd.freq - deltaT;
                var next = moment().add(arrive, "m");
                next = moment(next).format("HH:mm a");

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

    setInterval(updateTime, 60000);

});
