signal-window
=============

Window events without the DOM thrashing. `signal-window` will hold onto calculated window values and only
update them when they change and only inside a rAF tick. Get `width`, `height` and `scrollTop` from anywhere
in your code without having to remeasure the window (and hit the DOM) constantly.

```
npm install signal-window
```

Basic usage
=============

```
var win = require('signal-window');
win.on('resize', doResize)
    .on('orientationchange', doChange)
    .on('unload', doUnload)
    .on('scroll', doScroll)
    .on('load', doLoad);
```

Setup
=============

Latch into requestAnimationFrame:
```
var win = require('signal-window');
var tick = function() {
	win.tick();
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```
