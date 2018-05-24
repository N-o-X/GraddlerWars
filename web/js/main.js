var type = 'Player';
var loggedIn = false;
var lastLocked = '';
var lastCorrect = '';
var lastWrong = '';
var socket;

$(function() {
    socket = io();

    socket.on('add_team', function(team) {
        $('#teams').append(
            "<button class=\"teamButton colorBlack\" onclick=\"teamClick('" + team + "')\">" + team + "</button>"
        )
    });

    socket.on('login_success', function(data) {
        $('#login').css('display', 'none');
        $('#before_game').css('display', 'table');
        $('#player-name').html(data.name + ' - ' + data.team);
        loggedIn = true;
    });

    socket.on('update_round', function (round){
        $('#round').html(round);
    });

    socket.on('update_question', function(question){
        $('#question').html(question);
    });

    socket.on('update_answers', function(data){
        $('#answer-a').html(data.a);
        $('#answer-b').html(data.b);
        $('#answer-c').html(data.c);
        $('#answer-d').html(data.d);

        $('#counter-a').css('display', 'none');
        $('#counter-b').css('display', 'none');
        $('#counter-c').css('display', 'none');
        $('#counter-d').css('display', 'none');

        if (lastLocked) {
            $('#tile-' + lastLocked).removeClass('locked');
        }

        if (lastCorrect) {
            $('#tile-' + lastCorrect).removeClass('correct');
        }

        if (lastWrong) {
            $('#tile-' + lastWrong).removeClass('wrong');
        }
    });

    socket.on('update_correct', function(letter){
        if (letter !== lastLocked) {
            $('#tile-' + lastLocked).removeClass('locked').addClass('wrong');
            lastWrong = lastLocked;
        } else {
            $('#tile-' + lastLocked).removeClass('locked');
        }

        $('#tile-' + letter).addClass('correct');
        lastCorrect = letter;
    });

    socket.on('update_timer', function(time){
        $('#timer').html(time);
    });

    socket.on('update_count', function(data){
        $('#counter-' + data.letter).html(data.count).css('display', 'block');
    });

    socket.on('update_points', function(points){
        $('#points').html(points);
    });

    socket.on('update_teampoints', function(points){
        $('#team').html(points);
    });

    socket.on('lock_answer', function(letter){
        $('#tile-' + letter).addClass('locked');
        lastLocked = letter;
    });

    socket.on('start', function(loggedIn){
        if (loggedIn || type !== 'Player') {
            $('#before_game').css('display', 'none');
            $('#game').css('display', 'table');
        } else {
            window.location = '/view'
        }
    });

    socket.on('stop', function(msg){
        if (type === 'Master') {
            $('#game').css('display', 'none');
            $('#before_game').css('display', 'table');
        } else {
            if (loggedIn || type === 'Viewer') {
                window.location = '/';
            }
        }
    });
});


function teamClick(team) {
    socket.emit('login', {team: team, name: $('#name-field').val()});
}