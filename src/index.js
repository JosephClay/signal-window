const window = global;
const signal = require('signal-js');
const body = require('./body');
const html = require('./html');
const observable = signal.create();
const raf = window.requestAnimationFrame;

// See: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
// This is the same method that jQuery uses
// to get the window size
const measure = function() {
	const h = html();
	const b = body();

	return {
		width:  window.innerWidth  || (h && h.clientWidth)  || (b && b.clientWidth),
		height: window.innerHeight || (h && h.clientHeight) || (b && b.clientHeight)
	};
};

const scrollMeasure = function() {
	return {
		top: window.pageYOffset,
		left: window.pageXOffset
	};
};

// We've setup the measure function,
// so start out the script with some
// dimensions
let dimensions = measure();
let scrollPosition = scrollMeasure();

// Events strings. variablized as
// constants for minification
const RESIZE            = 'resize';
const ORIENTATIONCHANGE = 'orientationchange';
const UNLOAD            = 'unload';
const LOAD              = 'load';
const SCROLL            = 'scroll';

// Events ******************************

// Store the functions passed to addEventListener
// so that they can be unbound by the user

const eventOrientationChange = function() {
	observable.trigger(ORIENTATIONCHANGE, (dimensions = measure()));
};
const eventUnload = function() {
	observable.trigger(UNLOAD, (dimensions = measure()));
};
const eventScroll = function() {
	observable.trigger(SCROLL, (scrollPosition = scrollMeasure()));
};
const eventLoad = function() {
	observable.trigger(LOAD, (dimensions = measure()));
};

// Setup a pending resize function which raf will call
// if there's a resize event queued
let pendingResize;
const pendingResizeEvent = function() {
	observable.trigger(RESIZE, (dimensions = measure()));
};
// In this case, our event resize simply assigns
// the pendingResizeEvent (which dispatches the dimensions)
// to the pendingResize variable
const eventResize = function() {
	pendingResize = pendingResizeEvent;
};

// Bindings ******************************

const bind = function() {
	window.addEventListener(RESIZE,            eventResize,            false);
	window.addEventListener(SCROLL,            eventScroll,            false);
	window.addEventListener(ORIENTATIONCHANGE, eventOrientationChange, false);
	window.addEventListener(UNLOAD,            eventUnload,            false);
	window.addEventListener(LOAD,              eventLoad,              false);
};

const unbind = function() {
	window.removeEventListener(RESIZE,            eventResize,            false);
	window.removeEventListener(SCROLL,            eventScroll,            false);
	window.removeEventListener(ORIENTATIONCHANGE, eventOrientationChange, false);
	window.removeEventListener(UNLOAD,            eventUnload,            false);
	window.removeEventListener(LOAD,              eventLoad,              false);
};

// Init ******************************

bind();

// Public ******************************

module.exports = Object.assign(observable, {
	tick() {
		if (pendingResize) {
			pendingResize();
			pendingResize = undefined;
		}
		return observable;
	},

	scroll() {
		return scrollPosition;
	},
	scrollTop() {
		return scrollPosition.top;
	},
	scrollLeft() {
		return scrollPosition.left;
	},

	dimensions() {
		return dimensions;
	},
	width() {
		return dimensions.width;
	},
	height() {
		return dimensions.height;
	},

	measure() {
		return (dimensions = measure());
	},

	update() {
		return eventResize();
	},

	destroy() {
		unbind();
		observable.trigger('destroy');
		return observable;
	},

	// quick and dirty once
	start: (function() {
		const tick = function() {
			observable.tick();
			raf(tick);
		};
		let running = false;

		return function() {
			if (running) { return observable; }
			running = true;
			raf(tick);
			return observable;
		};
	}())
});