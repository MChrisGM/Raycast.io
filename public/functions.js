function hideMenu() {
    nameField.hide();
    createLobbyBtn.hide();
    randomLobbyBtn.hide();
    lobbyCode.hide();
    lobbyCodeBtn.hide();
    chatDiv.show();
    chatTextDiv.show();
    chatInput.show();
}

function showMenu() {
    nameField.show();
    createLobbyBtn.show();
    randomLobbyBtn.show();
    lobbyCode.show();
    lobbyCodeBtn.show();
    chatDiv.hide();
    chatTextDiv.hide();
    chatInput.hide();
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        //   console.log('Paused');
        paused = !paused;
    }
    // return false; // prevent default
}

function outFunc() {
    document.getElementById("myTooltip").innerHTML = "Copy to clipboard";
}

function setName() {
    socket.emit('username', nameField.value());
}

function copyCode() {
    document.getElementById("myTooltip").innerHTML = "Copied: " + lobby;
    var text = lobby;
    navigator.clipboard.writeText(text).then(function () {
        // console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        // console.error('Async: Could not copy text: ', err);
    });
}

function toggleCanvas() {
    moving = true;
}

function toggleChat() {
    moving = false;
}

function createCustom() {
    submitName();
    socket.emit('createCustom');
    socket.emit('sendMessage', { name: "", message: "" + player.getUname() + " connected!", time: "" });
    // socket.emit('sendMessage',{name: ""+player.getUname()+" connected!", message:""});
}