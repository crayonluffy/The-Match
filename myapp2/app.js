var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function getStartPosition() {
  //Randomly pick a start position on the map
  var x=0;
  var y=0;
  var map = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 0, 1, 1, 2, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
while(map[y][x]==0){
  x = Math.floor(Math.random()* 6/*map[0].length*/);
  y = Math.floor(Math.random()* 6/*map.length*/);
  console.log(x,y);
  console.log(map[y][x]);
}
  return [x,y];
}
var players = {};
var io = require('socket.io').listen(15000);
io.sockets.on('connection', function (socket) {
//BUG: reconnect -> double init
  //adding new player
    //init newPlayer
  console.log(socket.id);
  var newPlayer ={}
  newPlayer[socket.id] = getStartPosition();//pick at starting position for the new player

    //tell everyone
  socket.broadcast.emit('oppo join',newPlayer);//tell other players that there is a newcomer
  socket.emit('init', players);//give info to new player about player's starting position and position of others
  socket.emit('start', newPlayer);



  socket.on('move',function (coor) {
    console.log(socket.id,": moved");
    var update ={};
    update[socket.id] = players[socket.id] = coor;
    socket.broadcast.emit('oppo move', update);
    console.log(players);
  });

  socket.on('try attack', function () {
    socket.broadcast.emit('oppo try attack',socket.id);
  });

  socket.on('stop attack', function () {
    socket.broadcast.emit('oppo stop attack',socket.id);
  })

  socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.broadcast.emit('oppo left',socket.id);
        delete players[socket.id];
        console.log(players);
    });
});

module.exports = app;
