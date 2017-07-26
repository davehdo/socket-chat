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
let clientIds = []


// http://localhost:3000/socket.io/?EIO=3&transport=polling&t=Lrluz_S
io.on('connection', function (socket) {
	// socket.emit('news', { hello: 'world - this was sent from the server' });
	console.log(`A user has joined the conversation, await user to self identify`)

	// when user sends identification, join the room, and broadcast their entry to the room
	socket.on("notify-identity", (data) => {
		socket.userId = data.user_id
		console.log(`User is ${ socket.userId }`)
		
		socket.join("thread")
		clientIds = [...clientIds, data.user_id]

		// notify the user 
		socket.emit("message-out", {
			user_id: "undefined", 
			client_ids: clientIds, 
			contents: `Welcome. There are now ${clientIds.length} people in this conversation.`,
		})
		
		// notify the room
		socket.to("thread").emit( "message-out", {
			user_id: undefined,
			contents: `User ${ socket.userId } has joined the conversation. There are now ${clientIds.length} people.`,
			client_ids: clientIds,
		})
	})
	
	// when a user leaves, broadcast it
	socket.on("disconnect", (reason) => {
		leavingIndex = clientIds.indexOf( socket.userId )
		clientIds = [...clientIds.slice(0, leavingIndex), ...clientIds.slice(leavingIndex + 1)]

		socket.to("thread").emit("message-out", {
			user_id: undefined, 
			contents: `User ${ socket.userId } has disconnected. There are now ${ clientIds.length } people in this conversation.`,
	  		client_ids: clientIds })
	})

	// when a message comes in, broadcast it
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


