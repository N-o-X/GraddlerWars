var socket = io();
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

socket.on('start', function(msg){
    document.getElementById("before_game").style.display = "none";
    document.getElementById("game").style.display = "table";
});

socket.on('stop', function(msg){
    document.getElementById("before_game").style.display = "table";
    document.getElementById("game").style.display = "none";
});