//this fucntion tells the page to initiate thre request from client to server to open up the web socket and keep it open
const socket = io();



let counter=0

let messageVariables = {

}

$('#messages').scroll( function () {
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child');

  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();
  if (scrollTop+clientHeight+newMessageHeight+lastMessageHeight >= scrollHeight) {
    counter = 0;
    if ($('#counter')){
      $('#counter').remove();
    }
  }
});


function scrollToBottom () {
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child');

  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();


  if (scrollTop+clientHeight+newMessageHeight+lastMessageHeight >= scrollHeight) {
    counter = 0;
    messages.scrollTop(scrollHeight);
  } else if (scrollTop+clientHeight+newMessageHeight+lastMessageHeight < scrollHeight) {
    counter++;
    if (counter > 1) {
      let template = $('#notifier-message-template').html();
      let html = Mustache.render(template, {
        notifier: "New Message",
        counter
      });
      $('#notifierMessageLocation').append(html);
      window.setTimeout(() => {
        //$('#newMessageNotifier').remove();
        $('#notifierMessageLocation').children().fadeOut(2000, function () {
          $('#newMessageNotifier').last().remove();
        });
      }, 1000)
    } else if (counter <= 1) {
      let template = $('#notifier-message-template').html();
      let html = Mustache.render(template, {
        notifier: "New Message"
      });
      $('#notifierMessageLocation').append(html);
      $('#counter').remove();
      window.setTimeout(() => {
        //$('#newMessageNotifier').remove();
        $('#notifierMessageLocation').children().fadeOut(2000, function () {
          $('#newMessageNotifier').last().remove();
        });
      }, 1000)
    }

  };
};


socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom ();
});

$('#message-form').on('submit', function (e) {
  let messageTextbox = $('[name=message]')
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = $('#send-location');

locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.text('Sending...').attr('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.text('Share location').removeAttr('disabled');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.text('Share location').removeAttr('disabled');
    alert('Unable to fetch location. Location permission not granted.')
  });
});


socket.on('newLocationMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom ();
});
