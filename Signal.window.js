(function(Signal, window, document, undefined) {

	var _observable = Signal.construct(),

		// memoize the body so that
		// measures aren't constantly
		// querying the DOM
		_body = (function() {
			var body;
			return function() {
				return body || (body = document.getElementsByTagName('body')[0]);
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
		_LOAD              = 'load';

	// Events ******************************

	// Store the functions passed to addEventListener
	// so that they can be unbound by the user

	var _eventOrientationChange = function() {
			_observable.trigger(_ORIENTATIONCHANGE, (_dimensions = _measure()));
		},
		_eventUnload = function() {
			_observable.trigger(_UNLOAD, (_dimensions = _measure()));
		},
		_eventLoad = function() {
			_observable.trigger(_LOAD, (_dimensions = _measure()));
		},

		// Setup a pending resize function which raf will call
		// if there's a resize event queued
		_pendingResize,
		_pendingResizeEvent = function() {
			_observable.trigger(_RESIZE, (_dimensions = _measure()));
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
			_addEventListener(window, _ORIENTATIONCHANGE, _eventOrientationChange);
			_addEventListener(window, _UNLOAD,            _eventUnload);
			_addEventListener(window, _LOAD,              _eventLoad);
		},
		_unbind = function() {
			_removeEventListener(window, _RESIZE,            _eventResize);
			_removeEventListener(window, _ORIENTATIONCHANGE, _eventOrientationChange);
			_removeEventListener(window, _UNLOAD,            _eventUnload);
			_removeEventListener(window, _LOAD,              _eventLoad);
		};

	// Init ******************************

	_bind();

	// Public ******************************

	_observable.tick = function() {
		if (_pendingResize) {
			_pendingResize();
			_pendingResize = undefined;
		}
		return _observable;
	};

	_observable.getDimensions = function() {
		return _dimensions;
	};

	_observable.measure = function() {
		_dimensions = _measure();
		return _dimensions;
	};

	_observable.update = function() {
		return _eventResize();
	};

	_observable.destroy = function() {
		_unbind();
		_observable.trigger('destroy');
		return _observable;
	};

	// Expose the api
	Signal.window = _observable;

}(Signal, this, document));
