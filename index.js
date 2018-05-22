var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var count = {};
count['a'] = 0;
count['b'] = 0;
count['c'] = 0;
count['d'] = 0;

io.on('connection', function(socket) {
  for (var key in count) {
      socket.emit('update_count', key + '_' + count[key]);
  }

  socket.on('click', function(msg){
    count[msg]++;
    console.log('Count for ' + msg + ': ' + count[msg]);
    io.emit('update_count', msg + '_' + count[msg]);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
