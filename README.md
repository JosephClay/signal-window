Signal.window
=============

Window resize events without the DOM trashing.

```
var doSomething = function(dimensions) {};
Signal.window.on('resize', doSomething)
	.on('orientationchange', doSomething)
	.on('unload', doSomething)
	.on('load', doSomething);
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