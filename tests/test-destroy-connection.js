
if (typeof test == 'undefined') {
  alert('This script cannot be included directly.');
}

test.name('Destroy connection test');
test.timeout(5000);


test.run(function (doneCallback) {
  var chan;
  var errorraised;

  chan = test.createRandomChannel("rw");

  test.log('Waiting for channel to open');

  chan.onopen = function() {
    test.log('Destroying underlying connection');
    this._connection.destroy(new Error("Test Error"));
  };

  chan.onerror = function(exception) {
    if (exception.message != "Test Error") {
      return test.error(new Error("not equal (" + exception.message + ")"));
    }
    errorraised = true;
  };

  chan.onclose = function() {
    if (!errorraised) return test.error(new Error("Error not raised"));
    if (this._connection !== null) return test.error(new Error("connection not null"));
    chan.onerror = null;
    chan.onclose = null;
    doneCallback();
  };
});


test.run(function (doneCallback) {
  var chan;
  var errorraised;

  chan = test.createRandomChannel("rw");

  test.log('Waiting for channel to open');

  chan.onopen = function() {
    test.log('Resetting connection');
    chan._connection.sock.close();
  };

  chan.onerror = function(exception) {
    if (/Connection\sreset/.test(exception.message) == false) {
      console.log("HERE!");
      return test.error(new Error("not equal", exception.message));
    }
    errorraised = true;
  };

  chan.onclose = function() {
    if (!errorraised) return test.error(new Error("Error not raised"));
    if (this._connection !== null) return test.error(new Error("connection not null"));
    doneCallback();
  };
  
});