// const express = require('express')
// const app = express()


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



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io.js', function (req, res) {
  res.sendFile(__dirname + '/public/socket.io.js');
});

let messages = []

// http://localhost:3000/socket.io/?EIO=3&transport=polling&t=Lrluz_S
io.on('connection', function (socket) {
	// socket.emit('news', { hello: 'world - this was sent from the server' });
	console.log(`A user has joined the conversation`)

	// socket.to("thread").emit("message-out", {user_id: "admin", contents: `User ${} joined the room`})
	socket.join("thread")

	socket.on("notify-identity", (data) => {
		socket.userId = data.user_id
		console.log(`User is ${ socket.userId }`)
		
		socket.to("thread").emit( "message-out", {
			user_id: undefined,
			contents: `User ${ socket.userId } has joined the conversation`
		})
	})

	socket.on("disconnect", (reason) => {
	  socket.to("thread").emit("message-out", {user_id: undefined, contents: `User ${ socket.userId } has disconnected`})
	})

	socket.on('message-in', function (data) {
	  messages = [...messages, data]
	  // console.log("rec'd a message from a client")
	  socket.to("thread").emit("message-out", data )
	 // console.log(data);
	});
});

// Heroku dynamically assigns your app a port, so you can't set the port to a fixed number. Heroku adds the port to the env, so you can pull it from there. Switch your listen to this:
server.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})


