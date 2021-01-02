var express = require('express');
var app = express();
const fs = require('fs');

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Started server at https://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',
    function (socket) {
        console.log("New user with id: " + socket.id);
    }
);
