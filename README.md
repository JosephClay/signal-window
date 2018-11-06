## signal-window

Window events without the DOM thrashing. `signal-window` will hold onto calculated window values and only
update them when they change and only inside a `requestAnimationFrame` tick. Get `width`, `height` and 
`scrollTop` from anywhere in your code without having to remeasure the window (and hit the DOM) constantly.

## Intallation

```
npm install signal-window
```

## How to use

`signal-window` exposes an event emitter singleton that can be listened to for various window events.

```js
import window from 'signal-window';
window
  // these events will pass a memoized dimensions
  // object to the listeners
  .on('orientationchange', doChange)
  .on('unload', doUnload)
  .on('scroll', doScroll)
  .on('load', doLoad)
  // resize is debounced by requestAnimation frame
  .on('resize', doResize)
  // sets up a requestAnimationFrame loop
  .start();
```

## Setup

`signal-window` can be started with `.start()` or latched 
or latch into your existing requestAnimationFrame loop

```js
import window from 'signal-window';
const tick = function() {
	window.tick();
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

# License

The MIT License (MIT)

Copyright (c) 2018 Joseph Clay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.