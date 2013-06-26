
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var testChannel;

test.name('Maxlimit test');
test.timeout(5000);

test.setup(function (readyCallback) {
  testChannel = test.createRandomChannel('rw');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {
  var ctor = test.getChannelConstructor();
  var payload;
  var didthrow;

  payload = test.createRandomBuffer(500);

  if (!ctor.sizeOf(payload) == 500) {
    return test.error(new Error("SIZE_OF_ERR_" + ctor.sizeOf(payload)));
  }

  payload = test.createRandomBuffer(ctor.MAXSIZE + 1);

  try {
    testChannel.send(payload);
  } catch (err) {
    didthrow = true;
  }

  if (!didthrow) {
    return test.error(new Error("DID_NOT_THROW"));
  }

  doneCallback();
});

test.teardown(function (teardownCallback) {
  testChannel.onclose = teardownCallback;
  testChannel.close();
});