
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

test.name('Mode test');
test.timeout(5000);

test.run(function (doneCallback) {
  var didthrow = false;

  try {
    test.createRandomChannel('readwrite-signal');
  } catch (err) {
    didthrow = true;
  }

  if (!didthrow) {
    return test.error(new Error('did not throw'));
  }

  didthrow = false;

  try {
    test.createRandomChannel('not vaild');
  } catch (err) {
    didthrow = true;
  }

  if (!didthrow) return test.error(new Error('did not throw'));

  try {
    test.createRandomChannel(null, true).close();
    test.createRandomChannel('r', true).close();
    test.createRandomChannel('r+e', true).close();
    test.createRandomChannel('r+emit', true).close();
    test.createRandomChannel('read', true).close();
    test.createRandomChannel('read+e', true).close();
    test.createRandomChannel('read+emit', true).close();
    test.createRandomChannel('w', true).close();
    test.createRandomChannel('w+e', true).close();
    test.createRandomChannel('w+emit', true).close();
    test.createRandomChannel('write', true).close();
    test.createRandomChannel('write+e', true).close();
    test.createRandomChannel('write+emit', true).close();
    test.createRandomChannel('rw', true).close();
    test.createRandomChannel('rw+e', true).close();
    test.createRandomChannel('rw+emit', true).close();
    test.createRandomChannel('readwrite', true).close();
    test.createRandomChannel('readwrite+e', true).close();
    test.createRandomChannel('readwrite+emit', true).close();
  } catch (err) {
    return test.error(err);
  }

  doneCallback();
});