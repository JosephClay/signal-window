(function($, Signal, window) {
	
	var _NAME = 'signal-window',
		_window = $(window),
		// throttling the resize event
		// because it can fire quite fast
		// and cause DOM lock. If the page
		// is using Signal.window, it shouldn't
		// be a big deal. Problems could occur with
		// events firing out-of-order if scripts are
		// using $(window).resize and Signal.window
		_throttle = 50; // in ms
		
	var Window = (Signal.core.extend(function() {

		this.dimensions = this._measure();
		this._bind();
		this._loadUnload();

	}, {

		// Public ******************************
		getDimensions: function() {
			return this.dimensions;
		},

		measure: function() {
			this.dimensions = this._measure();
			return this.dimensions;
		},

		update: function() {
			return this._fire();
		},

		setThrottle: function(ms) {
			_throttle = +ms || 0;
			return this._unbind()._bind();
		},

		destroy: function() {
			this._unbind().trigger('destroy');
			return this;
		},

		// Private ******************************
		_bind: function() {
			var self = this,
				timeout,
				changeEvent = this._changeEvent = function() {
					clearTimeout(timeout);

					timeout = setTimeout(function() {
						self._fire();
					}, _throttle);
				};

			_window.on('resize.' + _NAME, changeEvent);

			if (window.addEventListener) {
				window.addEventListener('orientationchange', changeEvent, false);
			}

			return this;
		},

		_unbind: function() {
			_window.off('resize.' + _NAME);

			if (window.removeEventListener) {
				window.removeEventListener('orientationchange', this._changeEvent, false);
			}

			this.changeEvent = null;
			return this;
		},

		_fire: function() {
			this.trigger('resize', this.dimensions = this.measure());
			return this;
		},

		_measure: function() {
			return {
				width: _window.width(),
				height: _window.height()
			};
		},

		// Load | Unload ******************************
		_loadUnload: function() {
			var self = this;

			_window.on('unload.' + _NAME, function() {
				self.trigger('unload');
			});

			_window.on('load.' + _NAME, function() {
				self.trigger('load');
			});
		}
	}));

	// No need to wait for document.ready as
	// the window object is immediately available
	Signal.window = new Window();

}(jQuery, Signal, window));
