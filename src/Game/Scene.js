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

				var direction = {
		            RIGHT : 39,
		            LEFT  : 37,
		            UP    : 38,
		            DOWN  : 40
		        };

		        var keydowns = [];
		        var keyups = [];

				that.keydown = {
					right : function(callback) {
						keydowns.push({keycode : direction.RIGHT, callback : callback});
					},
					left : function(callback) {
						keydowns.push({keycode : direction.LEFT, callback : callback});
					},
					up : function(callback) {
						keydowns.push({keycode : direction.UP, callback : callback});
					},
					down : function(callback) {
						keydowns.push({keycode : direction.DOWN, callback : callback});
					},
					define : function(keycode, callback) {
						keydowns.push({keycode : keycode, callback : callback});
					}
				}

				that.keyup = {
					right : function(callback) {
						keyups.push({keycode : direction.RIGHT, callback : callback});
					},
					left : function(callback) {
						keyups.push({keycode : direction.LEFT, callback : callback});
					},
					up : function(callback) {
						keyups.push({keycode : direction.UP, callback : callback});
					},
					down : function(callback) {
						keyups.push({keycode : direction.DOWN, callback : callback});
					}
				}

				// that.when = function(e) {
				// 	var self = this;
				// 	return {
				// 		then : function(callback) {
				// 			window.addEventListener(e, callback);
				// 		}
				// 	}
				// }

				window.addEventListener('keydown', function(key) {
					for(var i = 0; i < keydowns.length; i++) {
						if (keydowns[i].keycode === key.keyCode) {
							keydowns[i].callback();
						}
					}
		        });

		        window.addEventListener('keyup', function(key) {
					for(var i = 0; i < keyups.length; i++) {
						if (keyups[i].keycode === key.keyCode) {
							keyups[i].callback();
						}
					}
		        });

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

		that.activeBorder = function(obj, minX, minY, maxX, maxY, callback) {
			collisionManager.setBorderCollisionModeOn(true, minX, minY, maxX, maxY);
			collisionManager.registerBehaviourForBorder({subject : obj, callback : function(info) {
				if (info.where === 'borderLeft') {
					obj.velX = 0;
					obj.position.x = 0;
				}

				if (info.where === 'borderRight') {
					obj.velX = 0;
					obj.position.x = sceneWidth - obj.width;
				}

				callback(info);
			}});
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

		that.shape = {
			add : {
				rectangle : function(spec) {
					var rectangle = square.createRectangle(spec);
					that.addChild(rectangle);
					return rectangle;
				},
				circle : function(spec) {
					var circle = square.createCircle(spec);
					that.addChild(circle);
					return circle;
				}
			}
		}

		that.text = {
			add : function(spec) {
				var text = square.createText(spec);
				that.addChild(text);
				return text;
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