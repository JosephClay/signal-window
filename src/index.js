import signal from 'signal-js';
import body from './body';
import html from './html';

const emitter = signal();

// See: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
// This is the same method that jQuery uses
// to get the global size
const measure = function() {
	const doc = html();
	const bod = body();

	return {
		width: global.innerWidth || (doc && doc.clientWidth) || (bod && bod.clientWidth),
		height: global.innerHeight || (doc && doc.clientHeight) || (bod && bod.clientHeight)
	};
};

const scrollMeasure = function() {
	return {
		top: global.pageYOffset,
		left: global.pageXOffset
	};
};

// We've setup the measure function,
// so start out the script with some
// dimensions
let dimensions = measure();
let scrollPosition = scrollMeasure();

// Events strings. variablized as
// constants for minification
const RESIZE = 'resize';
const ORIENTATIONCHANGE = 'orientationchange';
const UNLOAD = 'unload';
const LOAD = 'load';
const SCROLL = 'scroll';

// Events ******************************

// Store the functions passed to addEventListener
// so that they can be unbound by the user

const eventOrientationChange = () => emitter.emit(ORIENTATIONCHANGE, (dimensions = measure()));
const eventUnload = () => emitter.emit(UNLOAD, (dimensions = measure()));
const eventScroll = () => emitter.emit(SCROLL, (scrollPosition = scrollMeasure()));
const eventLoad = () => emitter.emit(LOAD, (dimensions = measure()));

// Setup a pending resize function which raf will call
// if there's a resize event queued
let pendingResize;
const pendingResizeEvent = () => emitter.trigger(RESIZE, (dimensions = measure()));
// In this case, our event resize simply assigns
// the pendingResizeEvent (which dispatches the dimensions)
// to the pendingResize variable
const eventResize = () => (pendingResize = pendingResizeEvent);

// Bindings ******************************

const bind = function() {
	global.addEventListener(RESIZE, eventResize, false);
	global.addEventListener(SCROLL, eventScroll, false);
	global.addEventListener(ORIENTATIONCHANGE, eventOrientationChange, false);
	global.addEventListener(UNLOAD, eventUnload, false);
	global.addEventListener(LOAD, eventLoad, false);
};

const unbind = function() {
	global.removeEventListener(RESIZE, eventResize, false);
	global.removeEventListener(SCROLL, eventScroll, false);
	global.removeEventListener(ORIENTATIONCHANGE, eventOrientationChange, false);
	global.removeEventListener(UNLOAD, eventUnload, false);
	global.removeEventListener(LOAD, eventLoad, false);
};

// Init ******************************

bind();

// Public ******************************

export default Object.assign(emitter, {
	tick() {
		if (pendingResize) {
			pendingResize();
			pendingResize = undefined;
		}
		return emitter;
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
		emitter.trigger('destroy');
		return emitter;
	},

	// quick and dirty once
	start: (function() {
		const raf = global.requestAnimationFrame;

		const tick = function() {
			emitter.tick();
			raf(tick);
		};
		let running = false;

		return function() {
			if (running) { return emitter; }
			running = true;
			raf(tick);
			return emitter;
		};
	}())
});