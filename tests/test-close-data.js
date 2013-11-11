
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var MESSAGE = "CLOSE_MESSAGE";

var emitListener;
var closingChannel;
  
test.name('Close data test');
test.timeout(5000);

test.setup(function (readyCallback) {
  emitListener = test.createChannel('', 'r');
  closingChannel = test.createChannel('emit-back-on-close', 'r');
  closingChannel.onclose = null;
  test.log('Waiting for channel to open');
  closingChannel.onopen = readyCallback;
});

test.run(function (doneCallback) {

  test.log('Closing channel with "%s"', MESSAGE);
  closingChannel.close(MESSAGE);

  emitListener.onsignal = function(e) {
    test.log('Received singal "%s"', e.data);
    if (e.data !== MESSAGE) {
      return test.error(new Error('diff error `' + e.data + '`!=' + MESSAGE + '`'));
    }
    doneCallback();
  };
});

test.teardown(function (teardownCallback) {
  emitListener.onclose = teardownCallback;
  emitListener.close();
});