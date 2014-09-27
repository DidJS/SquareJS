var SQUARE = (function(square) {
	square.createScene = function() {
		var that = {};
		that.backgroundColor = { startingColor : '#ffffff', endingColor : '#ffffff', mode : 'vertical' };
		that.children = [];
		var _isPaused = false;

		var collisionManager = square.getCollisionManager();

		that.keyboard = {
			create : function() {
				var that = {};

				that.when = function(e) {
					var self = this;
					return {
						then : function(callback) {
							window.addEventListener(e, callback);
						}
					}
				}

				return that;
			}
			
		};

		function getChild(obj) {
			var child;
			for(var i = 0; i < that.children.length; i++) {
				if (that.children[i].id === obj.id) {
					child = that.children[i];
					break;
				}
			}

			return child;
		}

		that.activeBorder = function(activeBorderCollision) {
			collisionManager.setBorderCollisionModeOn(activeBorderCollision);
		}

		that.setGradientBackgroundColor = function(spec) {
			this.backgroundColor = spec;
		}

		that.setBackgroundColor = function(color) {
			this.backgroundColor.startingColor = this.backgroundColor.endingColor = color;
		}

		that.pause = function() {
			_isPaused = !_isPaused;
		}

		that.isPaused = function() {
			return _isPaused;
		}

		that.addChild = function(child) {
			if (!getChild(child)) {
				this.children.push(child);
			}
			return this;
		}

		that.removeChild = function(child) {
			var index;
			for(var i = 0; i < this.children.length; i++) {
				if (this.children[i].id === obj.id) {
					index = i;
					break;
				}
			}

			if (index) {
				this.children.splice(index, 1);
			}
		}

		that.check = function(obj) {
			collisionManager.check(obj);
		}

		that.when = function(obj) {
			return {
				onCollisionWith : function(collisionObjects) {
					return {
						then : function(callback) {
							collisionManager.registerBehaviour({subject : obj, objects : collisionObjects, callback : callback});
						}
					};
				},
				onCollisionWithBorder : function() {
					return {
						then : function(callback) {
							collisionManager.registerBehaviourForBorder({subject : obj, callback : callback});
						}
					};
				}
			}
		}

		that.onTick = function() {
			var self = this;
			return {
				then : function(callback) {
					self.tick = callback;
				}
			};
		}

		return that;
	}

	return square;
}(SQUARE || {}))