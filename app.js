var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'graddlerworst',
    password : 'worstpasswort1234',
    database : 'GraddlerWorst'
});

app.get('/', function(req, res){
    if (isGameRunning) {
        res.sendFile(__dirname + '/web/view.html');
    } else {
        res.sendFile(__dirname + '/web/index.html');
    }
});

app.get('/master', function(req, res){
    res.sendFile(__dirname + '/web/master.html');
});

app.get('/view', function(req, res){
    res.sendFile(__dirname + '/web/view.html');
});

app.get('/css', function(req, res){
    res.sendFile(__dirname + '/web/css/style.css');
});


var questions = [
    "Wie alt ist ein Döner?",
    "Wieso ist Opa so laut?",
    "Warum ist die Banane krumm?"
];

var currentQuestion = Math.floor(Math.random()*questions.length);

var count = {};
count['a'] = 0;
count['b'] = 0;
count['c'] = 0;
count['d'] = 0;

var currentRound = 0;
var rounds = 2;
var timeRemaining = 10;
var isGameRunning = false;
var isRoundRunning = false;

io.on('connection', function(socket) {
    prepareClient(socket);

    socket.on('click', function(msg){
        if (isRoundRunning) {
            count[msg]++;
            console.log('Count for ' + msg + ': ' + count[msg]);
            io.emit('update_count', msg + '_' + count[msg]);
        }
    });

    socket.on('start', function(msg){
        io.emit('start');
        currentRound = 0;
        isGameRunning = true;
        nextQuestion();
    });

    socket.on('next_question', function(msg){
        nextQuestion();
    });
});

function nextQuestion() {
    for (var key in count) {
        count[key] = 0;
        io.emit('update_count', key + '_' + count[key]);
    }

    currentRound++;

    if (currentRound > rounds) {
        stopGame();
        return;
    }

    timeRemaining = 10;
    isRoundRunning = true;

    var questionID = Math.floor(Math.random()*questions.length);
    currentQuestion = questionID;
    var question = questions[questionID];

    io.emit('update_round', currentRound + '/' + rounds);
    io.emit('update_timer', timeRemaining);
    io.emit('update_question', question);
}

function stopGame() {
    isRoundRunning = false;
    isGameRunning = false;
    currentRound = 0;
    io.emit('stop');
    io.emit('update_round', currentRound + '/' + rounds);
}

function prepareClient(socket) {
    if (isGameRunning) {
        socket.emit('start');

        socket.emit('update_round', currentRound + '/' + rounds);
        socket.emit('update_question', questions[currentQuestion]);
        socket.emit('update_timer', timeRemaining);

        for (var key in count) {
            socket.emit('update_count', key + '_' + count[key]);
        }
    } else {
        socket.emit('stop');
    }
}

function questionTimer() {
    if (isRoundRunning) {
        timeRemaining--;

        io.emit('update_timer', timeRemaining);

        if (timeRemaining <= 0) {
            isRoundRunning = false;
        }
    }
}

setInterval(questionTimer, 1000);

http.listen(port, function(){
    console.log('listening on *:' + port);
});
