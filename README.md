Signal.window
=============

Window resize events without the DOM trashing for 1kb!

```
var doSomething = function(dimensions) {};
Signal.window.on('resize', doSomething)
	.on('orientationchange', doSomething)
	.on('unload', doSomething)
	.on('load', doSomething);
```

Setup
=============

1. Include [Signal](https://github.com/JosephClay/Signal) and [Signal.window](https://github.com/JosephClay/Signal.window) in the page.
2. Latch into requestAnimationFrame:
```
var tick = function() {
	Signal.window.tick();
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```
