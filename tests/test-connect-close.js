
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var testChannel;

test.name('Connect close test');
test.timeout(5000);

test.setup(function (readyCallback) {
  testChannel = test.createRandomChannel('rw');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {
  if (!testChannel.readable) return test.error(new Error("not readable"));
  if (!testChannel.writable) return test.error(new Error("not writable"));

  testChannel.onerror = function(exception) {
    test.error(exception);
  };

  testChannel.onclose = function() {
    doneCallback();
  };

  testChannel.close();
});