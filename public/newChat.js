function formatUNIXUTCTimeToLocale(time) {
  const clientUNIXNoughtOffset = new Date('1970-01-01 0:00').getTime();
  const date = new Date(time);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${ hours }:${ minutes }`;
}

//window.scrollTo(0, document.body.scrollHeight);
function createMessage(messageInfo) {
  var sender = messageInfo.name;
  var message = messageInfo.message;
  let timeAsUNIX = messageInfo.time;
  let timeString = formatUNIXUTCTimeToLocale(timeAsUNIX);
  // var time = messageInfo.time.split(":");
  // var timeOffset = new Date().toString().match(/([-\+][0-9]+)\s/)[1]
  // var timeOffsetSign = timeOffset.charAt(0);
  // var timeOffsetHours = timeOffset.substring(1, 3);
  // var timeOffsetMinutes = timeOffset.substring(3, 5);

  // switch (timeOffsetSign) {
  //   case '+':
  //     time[0] = +time[0] + +timeOffsetHours;
  //     time[1] = +time[1] + +timeOffsetMinutes;
  //     break;
  //   case '-':
  //     time[0] = +time[0] - +timeOffsetHours;
  //     time[1] = +time[1] - +timeOffsetMinutes;
  //     break;
  //   default:
  //     break;
  // }

  var element = document.createElement("div");
  var username = document.createElement("div");
  var timeDiv = document.createElement("div");
  var content = document.createElement("div");

  var divider = document.createElement("hr");
  divider.style.position = "relative";
  divider.style.zIndex = "11";

  element.appendChild(username);
  element.appendChild(content);

  username.style.color = 'white';
  username.className = "username";
  username.appendChild(document.createTextNode(sender));

  timeDiv.className = "messageTime";
  timeDiv.style.paddingLeft = "10px";
  // timeDiv.appendChild(document.createTextNode(" " + time[0] + ":" + time[1]));
  timeDiv.appendChild(document.createTextNode(timeString));

  username.appendChild(timeDiv);

  content.appendChild(document.createTextNode(message));
  content.className = "message"
  content.style.color = 'white';
  content.appendChild(document.createElement("br"));
  element.style.paddingTop = "2%";
  element.style.paddingLeft = "1%";
  element.appendChild(divider);

  document.getElementById('chatTextDiv').appendChild(element);

  var objDiv = document.getElementById("chatTextDiv");
  objDiv.scrollTop = objDiv.scrollHeight;
}