signal-window
=============

Window resize events without the DOM trashing for 1kb!

```
npm install signal-window
```

```
var doSomething = function(dimensions) {};
signal.window.on('resize', doSomething)
	.on('orientationchange', doSomething)
	.on('unload', doSomething)
	.on('load', doSomething);
```

Setup
=============

1. Include [signal](https://github.com/JosephClay/signal-js) and [signal-window](https://github.com/JosephClay/signal-window/blob/master/signal-window.js) in the page.
2. Latch into requestAnimationFrame:
```
var tick = function() {
	signal.window.tick();
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```
