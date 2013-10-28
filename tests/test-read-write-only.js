
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var readChannel;
var writeChannel;
  
test.name('Read-write-only test');
test.timeout(5000);

test.setup(function (readyCallback) {
  readChannel = test.createChannel(100, 'r', true);
  writeChannel = test.createChannel(101, 'w', true);
  test.log('Waiting for channels to open');
  writeChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {
  var didthrow;

  try {
    readChannel.write(test.createRandomBuffer(64));
  } catch (e) {
    didthrow = true;
  }

  if (!didthrow) {
   return test.error(new Error("did not throw"));
  }

  if (!readChannel.readable) {
    return test.error(new Error("not readable"));
  } 

  if (readChannel.writable) {
    return test.error(new Error("writable"));
  }

  doneCallback();
});

test.run(function (doneCallback) {

  if (writeChannel.readable) {
    return C(new Error("not readable"));
  }

  if (!writeChannel.writable) {
    return C(new Error("writable"));
  } 

  writeChannel.onmessage = function () {
    test.error(new Error("Should not populate data"));
  };

  writeChannel.send(test.createRandomBuffer(64));

  setTimeout(function() {
   doneCallback();
  }, 500);
});

test.teardown(function (teardownCallback) {
  readChannel.close();
  writeChannel.onclose = teardownCallback;
  writeChannel.close();
});