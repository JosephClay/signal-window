(function(name, window, document, factory) {

    if (typeof define === 'function') { // RequireJS
        define(['signal-js', window, document], factory);
    } else if (typeof module !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory(require('signal-js'), window, document);
    } else { // Browser
        window.signal[name] = factory(window.signal, window, document);
    }

})('window', window, document, function(signal, window, document, undefined) {

	var observable = signal.create(),

		// memoize the body so that
		// measures aren't constantly
		// querying the DOM
		_body = (function() {
			var body;
			return function() {
				return body || (body = document.body);
			};
		}()),

		// See: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
		// This is the same method that jQuery uses
		// to get the window size
		_measure = function() {
			return {
				width:  window.innerWidth  || document.documentElement.clientWidth  || _body().clientWidth,
				height: window.innerHeight || document.documentElement.clientHeight || _body().clientHeight
			};
		},

		_top = window.pageYOffset,

		// We've setup the measure function,
		// so start out the script with some
		// dimensions
		_dimensions = _measure(),

		// Event Helpers to attach and detach
		// events in IE8+
		_addEventListener = function(elem, eventName, handler) {
			if (elem.addEventListener) {
				return elem.addEventListener(eventName, handler);
			}

			elem.attachEvent('on' + eventName, function() {
				handler.call(elem);
			});
		},
		_removeEventListener = function(elem, eventName, handler) {
			if (elem.removeEventListener) {
				return elem.removeEventListener(eventName, handler);
			}

			elem.detachEvent('on' + eventName, handler);
		},

		// Events strings. variablized as
		// constants for minification
		_RESIZE            = 'resize',
		_ORIENTATIONCHANGE = 'orientationchange',
		_UNLOAD            = 'unload',
		_LOAD              = 'load',
		_SCROLL            = 'scroll';

	// Events ******************************

	// Store the functions passed to addEventListener
	// so that they can be unbound by the user

	var _eventOrientationChange = function() {
			observable.trigger(_ORIENTATIONCHANGE, (_dimensions = _measure()));
		},
		_eventUnload = function() {
			observable.trigger(_UNLOAD, (_dimensions = _measure()));
		},
		_eventScroll = function() {
			observable.trigger(_SCROLL, (_top = window.pageYOffset));
		},
		_eventLoad = function() {
			observable.trigger(_LOAD, (_dimensions = _measure()));
		},

		// Setup a pending resize function which raf will call
		// if there's a resize event queued
		_pendingResize,
		_pendingResizeEvent = function() {
			observable.trigger(_RESIZE, (_dimensions = _measure()));
		},
		// In this case, our event resize simply assigns
		// the pendingResizeEvent (which dispatches the dimensions)
		// to the pendingResize variable
		_eventResize = function() {
			_pendingResize = _pendingResizeEvent;
		};

	// Bindings ******************************

	var _bind = function() {
			_addEventListener(window, _RESIZE,            _eventResize);
			_addEventListener(window, _SCROLL,            _eventScroll);
			_addEventListener(window, _ORIENTATIONCHANGE, _eventOrientationChange);
			_addEventListener(window, _UNLOAD,            _eventUnload);
			_addEventListener(window, _LOAD,              _eventLoad);
		},
		_unbind = function() {
			_removeEventListener(window, _RESIZE,            _eventResize);
			_removeEventListener(window, _SCROLL,            _eventScroll);
			_removeEventListener(window, _ORIENTATIONCHANGE, _eventOrientationChange);
			_removeEventListener(window, _UNLOAD,            _eventUnload);
			_removeEventListener(window, _LOAD,              _eventLoad);
		};

	// Init ******************************

	_bind();

	// Public ******************************

	observable.tick = function() {
		if (_pendingResize) {
			_pendingResize();
			_pendingResize = undefined;
		}
		return observable;
	};

	observable.scrollTop = function() {
		return _top;
	};

	observable.dimensions = function() {
		return _dimensions;
	};

	observable.measure = function() {
		return (_dimensions = _measure());
	};

	observable.update = function() {
		return _eventResize();
	};

	observable.destroy = function() {
		_unbind();
		observable.trigger('destroy');
		return observable;
	};

	// Expose the api
	return observable;

});
