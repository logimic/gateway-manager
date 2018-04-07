var WebSocketServer = require('websocket').server;
var http = require('http');

var interval = null;

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(256, function() {
    console.log("server started ::256");
 });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept('cobalt', request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    console.log("connection on");
    connection.sendUTF('this is response');
  });

  connection.on('close', function(connection) {
    // close user connection
  });

  var lat_ = 45;
  var lon_ = 18;
  var az_ = 69; 

  interval = setInterval(function(){
      lat_ = lat_ + (0.5 - Math.random()) * 0.001;
      lon_ = lon_ + (0.5 - Math.random()) * 0.001;
      az_ = az_ + (0.5 - Math.random()) * 5;
      var data = `{"data": {"lat":${lat_}, "lon":${lon_}, "alt":0, "azi":${az_}, "fov":45}}`;
      connection.sendUTF(data);
      //console.log(data);
  }
  , 200)



});