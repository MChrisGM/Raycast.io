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
    if(keyCode == 84){
      if(moving){
        toggleChat();
      }
    }
    if(keyCode == 13){
      if(chatInput.value()=="" && !moving){
        toggleCanvas();
      }
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
    document.getElementById('chatInput').blur();
    canvas.focus();
}

function toggleChat() {
    moving = false;
    document.getElementById('chatInput').focus();
    canvas.blur();
    chatInput.value("");
}

function createCustom() {
    submitName();
    socket.emit('createCustom');
    socket.emit('sendMessage', { name: "", message: "" + player.getUname() + " connected!", time: "" });
    // socket.emit('sendMessage',{name: ""+player.getUname()+" connected!", message:""});
}

// function HSVtoRGB(h, s, v) {
//     var r, g, b, i, f, p, q, t;
//     if (arguments.length === 1) {
//         s = h.s, v = h.v, h = h.h;
//     }
//     i = Math.floor(h * 6);
//     f = h * 6 - i;
//     p = v * (1 - s);
//     q = v * (1 - f * s);
//     t = v * (1 - (1 - f) * s);
//     switch (i % 6) {
//         case 0: r = v, g = t, b = p; break;
//         case 1: r = q, g = v, b = p; break;
//         case 2: r = p, g = v, b = t; break;
//         case 3: r = p, g = q, b = v; break;
//         case 4: r = t, g = p, b = v; break;
//         case 5: r = v, g = p, b = q; break;
//     }
//     return {
//         r: Math.round(r * 255),
//         g: Math.round(g * 255),
//         b: Math.round(b * 255)
//     };
// }

function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
}