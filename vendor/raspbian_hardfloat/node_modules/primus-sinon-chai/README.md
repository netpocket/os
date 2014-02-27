# primus-sinon-chai

Provides additional assertions and stubs I use while
testing realtime applications built on [Primus](https://github.com/primus/primus)

Works in the browser and node.js

For browser use, it expects you to have already loaded underscore (or
lodash?), sinon, chai, sinon-chai

## Usage

### nodejs setup

`npm install --save-dev primus-sinon-chai`

```js
var psc = require('primus-sinon-chai');
global.expect = psc.chai.expect;
global.sinon = psc.sinon;
global.sparkStub = psc.spark;
```

### browser setup

`bower install --save-dev primus-sinon-chai`

```html
<script src="bower_components/chai/chai.js"></script>
<script src="bower_components/sinonjs-built/pkg/sinon.js"></script>
<script src="bower_components/sinon-chai/lib/sinon-chai.js"></script>

<script src="bower_components/underscore/underscore.js"></script>
<script src="bower_components/primus-sinon-chai/index.js"></script>
```

### example tests

```js
var dConnA = null, bConnA = null;

describe("communicate bridge", function() {
  beforeEach(function() {
    bConnA = {
      spark: sparkStub()
    };
    dConnA = {
      spark: sparkStub()
    };
  });

  it("listens to all connected devices", function() {
    expect(bConnA.spark).to.listenOn('device:1');
    expect(bConnA.spark).to.listenOn('device:2');
  });

  it("does not listen to itself", function() {
    expect(bConnA.spark).not.to.listenOn('browser:1');
  });

  it("does not listen to other browsers", function() {
    expect(bConnA.spark).not.to.listenOn('browser:2');
  });

  it("listens once for a special command", function() {
    expect(bConnA.spark).to.listenOnce('look, ill only say this once');
  });

  it("works", function() {
    bConnA.spark.onCallback('device:1')({
      listen: "once"
    });

    expect(dConnA.emit).to.have.been.calledWith(
      'relay',
      'browser:1',
      { listen: 'once' }
    );

    dConnA.spark.onceCallback('browser:1')({
      the: 'response'
    });

    expect(bConnA.emit).to.have.been.calledWith(
      'device:1', 
      { the: 'response'}
    );
  });
});
```
