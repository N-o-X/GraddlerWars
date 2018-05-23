"use strict";

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;
let Player = require('./models/player.js');

let mysql      = require('mysql');
let connection = mysql.createConnection({
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

app.get('/js', function(req, res){
    res.sendFile(__dirname + '/web/js/main.js');
});


let questions = [
    "Wie alt ist ein Döner?",
    "Wieso ist Opa so laut?",
    "Warum ist die Banane krumm?"
];

let players = {};

let currentQuestionRow = [];
let count = {};
count['a'] = 0;
count['b'] = 0;
count['c'] = 0;
count['d'] = 0;

let currentRound = 0;
let rounds = 2;
let timeRemaining = 10;
let isGameRunning = false;
let isRoundRunning = false;

io.on('connection', function(socket) {
    prepareClient(socket);

    socket.on('name', function(msg){
        players[socket.id].name = msg;
    });

    socket.on('click', function(msg){
        if (isRoundRunning && !players[socket.id].locked) {
            count[msg]++;
            players[socket.id].locked = true;
            console.log('Count for ' + msg + ': ' + count[msg]);
            io.emit('update_count', msg + '_' + count[msg]);
        } else if (players[socket.id].locked) {
            console.log('Client ' + socket.id +  ' is locked!');
        }
    });

    socket.on('start', function(msg){
        for (let socketID in Object.keys(io.sockets.sockets)) {
            /*let socket = io.sockets.sockets[socketID];

            if (players[socket.id].loggedIn)  {
                socket.emit('start', true);
            } else {
                socket.emit('start', false);
            }*/
        }

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
    for (let key in count) {
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

    connection.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1', function (error, results, fields) {
        if (error) throw error;

        currentQuestionRow = results[0];

        io.emit('update_round', currentRound + '/' + rounds);
        io.emit('update_timer', timeRemaining);
        io.emit('update_question', results[0].question);
        io.emit('update_answer_a', results[0].answer_a);
        io.emit('update_answer_b', results[0].answer_b);
        io.emit('update_answer_c', results[0].answer_c);
        io.emit('update_answer_d', results[0].answer_d);

        for (let socketid in players) {
            players[socketid].locked = false;
        }
    });
}

function stopGame() {
    isRoundRunning = false;
    isGameRunning = false;
    currentRound = 0;
    io.emit('stop');
    io.emit('update_round', currentRound + '/' + rounds);
}

function prepareClient(socket) {
    players[socket.id] = new Player();
    if (isGameRunning) {
        socket.emit('start');

        socket.emit('update_round', currentRound + '/' + rounds);
        socket.emit('update_timer', timeRemaining);
        socket.emit('update_question', currentQuestionRow.question);
        socket.emit('update_answer_a', currentQuestionRow.answer_a);
        socket.emit('update_answer_b', currentQuestionRow.answer_b);
        socket.emit('update_answer_c', currentQuestionRow.answer_c);
        socket.emit('update_answer_d', currentQuestionRow.answer_d);

        for (let key in count) {
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
