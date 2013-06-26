
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var MESSSAGES_TO_SEND = 1000;
var MESSAGE_SIZE      = 512;

var testChannel;
  
test.name('Message burst test');
test.timeout(30000);

test.setup(function (readyCallback) {
  testChannel = test.createRandomChannel('rw');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {
  var payload = test.createRandomBuffer(MESSAGE_SIZE);
  var count = 0;

  testChannel.onmessage = function (e) {
    if (test.buffersAreEqual(payload, e.data) == false) {
      return test.error(new Error("Buffer diff error"));
    } else {
      if (++count == MESSSAGES_TO_SEND) {
        doneCallback();
      }
    }
  };

  test.log('Sending %s (%s bytes each) messages',
                MESSSAGES_TO_SEND,
                MESSAGE_SIZE);

  for (var i = 0; i < MESSSAGES_TO_SEND; i++) {
    testChannel.send(payload);
  }
});

test.teardown(function (teardownCallback) {
  testChannel.onclose = teardownCallback;
  testChannel.close();
});