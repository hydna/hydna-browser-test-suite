
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var SIGNAL_REQ        = 'ping';
var SIGNAL_RESP       = 'pong';

var testChannel;
  
test.name('Signal test');
test.timeout(5000);

test.setup(function (readyCallback) {
  testChannel = test.createRandomChannel('rw+e');
  test.log('Waiting for channel to open');
  testChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {

  test.log('Emitting singal "%s"', SIGNAL_REQ);

  testChannel.emit(SIGNAL_REQ);

  testChannel.onsignal = function(e) {
    test.log('Received singal "%s"', e.data);
    if (e.data !== SIGNAL_RESP) {
      return test.error(new Error('diff error `' + e.data + '`!=' + SIGNAL_RESP + '`'));
    }
    doneCallback();
  };
});

test.teardown(function (teardownCallback) {
  testChannel.onclose = teardownCallback;
  testChannel.close();
});