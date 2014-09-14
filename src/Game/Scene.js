var SQUARE = (function(square) {
	square.createScene = function() {
		var that = {};
		that.children = [];

		var collisionManager = square.getCollisionManager();

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

		that.addChild = function(child) {
			if (!getChild(child)) {
				this.children.push(child);
			}
			return this;
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

		return that;
	}

	return square;
}(SQUARE || {}))