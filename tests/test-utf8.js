
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var MESSSAGES_TO_SEND = 100;
var MESSAGE_SIZE      = 512;

var testChannel;
  
test.name('UTF-8 test');
test.timeout(30000);

test.setup(function (readyCallback) {
  testChannel = test.createRandomChannel('rw');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {
  var payload = test.createRandomBuffer(MESSAGE_SIZE);
  var payloads = [];
  var count = 0;

  for (var i = 0; i < MESSSAGES_TO_SEND; i++) {
    payloads[i] = test.createRandomString(512);
  }

  testChannel.onmessage = function (e) {
    var payload = payloads.shift();

    if (test.stringsAreEqual(payload, e.data) == false) {
      return test.error(new Error("diff error"));
    }

    if (++count == MESSSAGES_TO_SEND) {
      doneCallback();
    }
  };

  test.log('Sending %s (%s bytes each) messages',
                MESSSAGES_TO_SEND,
                MESSAGE_SIZE);

  for (var i = 0; i < MESSSAGES_TO_SEND; i++) {
    testChannel.send(payloads[i]);
  }
});

test.teardown(function (teardownCallback) {
  testChannel.onclose = teardownCallback;
  testChannel.close();
});