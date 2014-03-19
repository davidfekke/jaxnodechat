
/**
 * Module dependencies.
 */

var express = require('express')
, app = express()
, http = require('http')
, server = http.createServer(app)
, io = require('socket.io').listen(server);
var path = require('path');
var users = [];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({ secret: 'jaxnodechatsecret' }));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.on('addUser', function (data) {
		console.log(data);
		//users.push(data.user);
		addToUsersArray(data.user);
		io.sockets.emit('newUserAddedMessage', { name: data.user });
		io.sockets.emit('usersInChat', { users: users });
	});
	socket.on('sendMessage', function(data) {
		io.sockets.emit('chat', { user: data.user, message: data.message });
	});
	socket.on('disconnectUser', function (data) {
		removeFromUsersArray(data.user);
		io.sockets.emit('userRemovedMessage', { name: data.user});
	});
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function addToUsersArray(user) {
	var userAlreadyExists = false;
	for (var i = 0; i < users.length; i++)
	{
		if (user === users[i]){
			userAlreadyExists = true;
		}
	}
	if (userAlreadyExists === false)
	{
		users.push(user);
	}
}

function removeFromUsersArray(user) {
	var index = users.indexOf(user);
	if (index > -1) {
		users.splice(index, 1);
	}
}
