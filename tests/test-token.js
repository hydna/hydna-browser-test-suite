
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var TOKEN             = 'TOKEN';

var testChannel;
  
test.name('token test');
test.timeout(5000);

test.setup(function (readyCallback) {
  testChannel = test.createChannel('test-token?' + TOKEN, 'rw+e');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback, e) {
  if (e.data != TOKEN) {
    return test.error(new Error('diff error `' + e.data + '`!=' + TOKEN + '`'));
  }
  doneCallback();
});

test.teardown(function (teardownCallback) {
  testChannel.onclose = teardownCallback;
  testChannel.close();
});