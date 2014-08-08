Signal.window
=============

Window resize events without the DOM trashing.

```
var doSomething = function(dimensions) {};
Signal.window.on('resize', doSomething);
Signal.window.on('orientationchange', doSomething);
Signal.window.on('unload', doSomething);
Signal.window.on('load', doSomething);
```

Setup
=============

Include in page and latch into requestAnimationFrame
```
var tick = function() {
	Signal.window.tick();
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```