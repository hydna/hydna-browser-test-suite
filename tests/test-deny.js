
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

var DENY_RESP         = 'DENIED';

var testChannel;
  
test.name('deny test');
test.timeout(10000);

test.setup(function (readyCallback) {
  testChannel = test.createChannel('open-deny', 'rw+e');
  test.log('Waiting for channel to open');
  testChannel.onopen = testChannel.onclose = readyCallback;
});

test.run(function (doneCallback, e) {
  if (e.type != "close") {
    return test.error(new Error('Expected CloseEvent'));
  }
  if (e.wasDenied !== true) {
    return test.error(new Error('Expected wasDenied==true'));
  }
  if (e.reason != DENY_RESP) {
    return test.error(new Error('Bad reason `' + e.reason + '`!=' + DENY_RESP + '`'));
  }
  doneCallback();
});