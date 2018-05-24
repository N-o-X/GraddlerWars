var socket = io();

var type = "Player";
var loggedIn = false;

socket.on('login_success', function() {
    document.getElementById("login").style.display = "none";
    document.getElementById("before_game").style.display = "table";
    loggedIn = true;
});

socket.on('update_round', function (round){
    $('#round').html(round);
});

socket.on('update_question', function(question){
    $('#question').html(question);
});

socket.on('update_answers', function(data){
    $('#answerA').html(data.a);
    $('#answerB').html(data.b);
    $('#answerC').html(data.c);
    $('#answerD').html(data.d);
});

socket.on('update_timer', function(msg){
    $('#timer').html(msg);
});

socket.on('update_count', function(data){
    $('#counter-' + data.letter).html(data.count);
});

socket.on('lock_answer', function(letter){
    $('')
});

socket.on('start', function(loggedIn){
    if (loggedIn || type !== "Player") {
        document.getElementById("before_game").style.display = "none";
        document.getElementById("game").style.display = "table";
    } else {
        window.location = "/view"
    }
});

socket.on('stop', function(msg){
    if (type === "Master") {
        document.getElementById("game").style.display = "none";
        document.getElementById("before_game").style.display = "table";
    } else {
        if (loggedIn || type === "Viewer") {
            window.location = "/";
        }
    }
});