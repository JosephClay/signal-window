import signal from 'signal-js';
import body from './body';
import html from './html';

// events strings variablized as
// constants for minification
const RESIZE = 'resize';
const ORIENTATIONCHANGE = 'orientationchange';
const UNLOAD = 'unload';
const LOAD = 'load';
const SCROLL = 'scroll';

// the emitter
const emitter = signal();

// our data object
const data = {};

// See: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
// This is the same method that jQuery uses
// to get the global size
const measure = function() {
	const doc = html();
	const bod = body();

	data.width = global.innerWidth || (doc && doc.clientWidth) || (bod && bod.clientWidth);
	data.height = global.innerHeight || (doc && doc.clientHeight) || (bod && bod.clientHeight);
	
	return data;
};

const scrollMeasure = function() {
	data.top = global.pageYOffset;
	data.left = global.pageXOffset;
	
	return data;
};

// Events ******************************

// Store the functions passed to addEventListener
// so that they can be unbound by the user

const eventOrientationChange = () => emitter.emit(ORIENTATIONCHANGE, measure());
const eventUnload = () => emitter.emit(UNLOAD, measure());
const eventScroll = () => emitter.emit(SCROLL, scrollMeasure());
const eventLoad = () => emitter.emit(LOAD, measure());

// Setup a pending resize function which raf will call
// if there's a resize event queued
let pendingResize;
const pendingResizeEvent = () => emitter.trigger(RESIZE, measure());
// In this case, our event resize simply assigns
// the pendingResizeEvent (which dispatches the dimensions)
// to the pendingResize variable
const eventResize = () => (pendingResize = pendingResizeEvent);

// Bindings ******************************

const bind = function() {
	const { addEventListener } = global;
	if (!addEventListener) return;
	addEventListener(RESIZE, eventResize, false);
	addEventListener(SCROLL, eventScroll, false);
	addEventListener(ORIENTATIONCHANGE, eventOrientationChange, false);
	addEventListener(UNLOAD, eventUnload, false);
	addEventListener(LOAD, eventLoad, false);
};

const unbind = function() {
	const { removeEventListener } = global;
	if (!removeEventListener) return;
	removeEventListener(RESIZE, eventResize, false);
	removeEventListener(SCROLL, eventScroll, false);
	removeEventListener(ORIENTATIONCHANGE, eventOrientationChange, false);
	removeEventListener(UNLOAD, eventUnload, false);
	removeEventListener(LOAD, eventLoad, false);
};

// Init ******************************

measure();
scrollMeasure();
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
		return {
			top: data.top,
			left: data.left,
		};
	},
	scrollTop() {
		return data.top;
	},
	scrollLeft() {
		return data.left;
	},

	dimensions() {
		return {
			width: data.width,
			height: data.height,
		};
	},
	width() {
		return data.width;
	},
	height() {
		return data.height;
	},

	measure() {
		return measure();
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