'use strict';
const express = require('express');
var users = [];

module.exports = function(io) {
    var router = express.Router();
    
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
            io.sockets.emit('usersInChat', { users: users });
        });
    });

    return router;   
}

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