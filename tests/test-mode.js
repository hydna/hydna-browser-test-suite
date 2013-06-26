
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
    test.createRandomChannel(null).close();
    test.createRandomChannel('r').close();
    test.createRandomChannel('r+e').close();
    test.createRandomChannel('r+emit').close();
    test.createRandomChannel('read').close();
    test.createRandomChannel('read+e').close();
    test.createRandomChannel('read+emit').close();
    test.createRandomChannel('w').close();
    test.createRandomChannel('w+e').close();
    test.createRandomChannel('w+emit').close();
    test.createRandomChannel('write').close();
    test.createRandomChannel('write+e').close();
    test.createRandomChannel('write+emit').close();
    test.createRandomChannel('rw').close();
    test.createRandomChannel('rw+e').close();
    test.createRandomChannel('rw+emit').close();
    test.createRandomChannel('readwrite').close();
    test.createRandomChannel('readwrite+e').close();
    test.createRandomChannel('readwrite+emit').close();
  } catch (err) {
    return test.error(err);
  }

  doneCallback();
});