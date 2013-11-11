
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var START_CHANNEL     = 100;
var MAX_CHANNELS      = 200;
var LAST_CHANNEL      = START_CHANNEL + MAX_CHANNELS;

var channels = [];
  
test.name('Multi-channel test');
test.timeout(10000);


test.setup(function (readyCallback) {
  var count = 0;
  var channel;

  for (var id = START_CHANNEL; id < LAST_CHANNEL + 1; id++) {
    test.log('Open channel %s', id);

    channel = test.createChannel(id, "rw");

    channel.onopen = function () {
      if (count++ == MAX_CHANNELS) {
        readyCallback();
      }
    };

    channels.push(channel);
  }
});



test.run(function (doneCallback) {
  var count = 0;
  var channel;

  for (var idx = 0; idx < channels.length; idx++) {
    channel = channels[idx];

    channel.onmessage = function (e) {
      if (e.data != this.url) {
        done = true;
        return test.error(new Error('Wrong message'));
      }
      if (count++ == MAX_CHANNELS) {
        doneCallback();
      }
    };

    test.log('Sending data to channel %s', channel.url);

    channel.send(channel.url);
  }
});


test.teardown(function (teardownCallback) {
  var count = 0;
  var channel;

  for (var idx = 0; idx < channels.length; idx++) {
    channel = channels[idx];
    channel.onclose = function () {
      if (count++ == MAX_CHANNELS) {
        teardownCallback();
      }
    };

    test.log('Closing channel %s', channel.url);

    channel.close();
  }
});