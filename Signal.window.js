(function(Signal, _window) {
	
	var _throttle = 100; // ms
		
	var Window = (Signal.core.extend(function() {

		this.dimensions = this._measure();
		this._bind();

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
			_throttle = ms;
			return this._unbind()._bind();
		},

		destroy: function() {
			this._unbind().trigger('destroy');
			return this;
		},

		// Private ******************************
		_bind: function() {
			var self = this, t;

			_window.on('resize.SignalWindow', function() {
				clearTimeout(t);

				t = setTimeout(function() {
					self._fire();
				}, _throttle);
			});

			return this;
		},

		_unbind: function() {
			_window.off('resize.SignalWindow');
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
		}
	}));

	// No need to wait for document.ready as the window object is immediately available
	Signal.window = new Window();

}(Signal, $(window)));
