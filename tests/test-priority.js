
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var testChannel;
  
test.name('Priority test');
test.timeout(10000);

test.setup(function (readyCallback) {
  testChannel = test.createRandomChannel('rw');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {
  var payloads = [];
  var count = 0;

  testChannel.onmessage = function(e) {
    var payload = payloads.shift();

    if (count < 4) {
      if (test.stringsAreEqual(payload, e.data) == false ||
          e.priority !== count) {
        return test.error(new Error("diff error"));
      }
    } else {
      if (test.buffersAreEqual(payload, e.data) == false ||
          e.priority + 4 !== count) {
        return test.error(new Error("diff error"));
      }
    }

    if (++count == 8) {
      doneCallback();
    }
  };

  for (var i = 0; i < 4; i++) {
    payloads.push(test.createRandomString(64));
    test.log('Sending "string" with prio %s', i);
    testChannel.send(payloads[payloads.length - 1], i);
  }

  for (var i = 0; i < 4; i++) {
    payloads.push(test.createRandomBuffer(64));
    test.log('Sending "binary" with prio %s', i);
    testChannel.send(payloads[payloads.length - 1], i);
  }

});

test.teardown(function (teardownCallback) {
  testChannel.onclose = teardownCallback;
  testChannel.close();
});