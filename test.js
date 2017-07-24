// const express = require('express')
// const app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
//
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })


var app = require('express')();
// framework for webpages
// can title app by setting app.locals.title = "My App"
// handles routing via app.get...
// app.listen is IDENTICAL to node's http.server.listen


// creates a server to bind to the server to bind to
// not sure if this is necessary but its done in the socket.io demo
var server = require('http').Server(app);


var io = require('socket.io')(server, {
	// path: "/test",
	// serveClient: false,
}); // equivalent to new server()



// server.listen(80);
//
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io.js', function (req, res) {
  res.sendFile(__dirname + '/public/socket.io.js');
});

let messages = []

// http://localhost:3000/socket.io/?EIO=3&transport=polling&t=Lrluz_S
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world - this was sent from the server' });
  
  socket.join("thread")
  
  socket.on('message-in', function (data) {
	  messages = [...messages, data]
	  // console.log("rec'd a message from a client")
	  socket.to("thread").emit("message-out", data )
    // console.log(data);
  });
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


