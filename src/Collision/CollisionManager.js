var SQUARE = (function(square) {

	square.createBorderCollisionManager = function(borderInfo) {
		var that = {};

		that.isCollidingOnBorderLeft = function(obj) {
			if (borderInfo) {
				return obj.position.x < borderInfo.minX;
			}
			
			return false;
		};

		that.isCollidingOnBorderRight = function(obj) {
			if (borderInfo) {
				return obj.position.x + obj.width > borderInfo.x;
			}
			
			return false;
		};

		that.isCollidingOnGround = function(obj) {
			if (borderInfo) {
				return obj.position.y + obj.height > borderInfo.y;
			}
			
			return false;
		};

		that.isCollidingOnTop = function(obj) {
			if (borderInfo) {
				return obj.position.y < borderInfo.minY;
			}
			
			return false;
		};

		return that;
	}

	square.createBoxCollisionManager = function() {
		var that = {};

		that.boxWithBoxCollision = function(obj1, obj2) {
			var c1X = obj1.getCenterPositionX();
			var c2X = obj2.getCenterPositionX();

			var overlapX = Math.floor(Math.round(obj1.halfWidth + obj2.halfWidth) - Math.round(Math.abs(c1X - c2X))); // distance entre les centres en X
			
			if (overlapX <= 0) {
				return '';
			}

			var c1Y = obj1.getCenterPositionY();
			var c2Y = obj2.getCenterPositionY();

			var overlapY = Math.floor(Math.round(obj1.halfHeight + obj2.halfHeight) - Math.round(Math.abs(c1Y - c2Y))); // distance entre les centres en Y

			if (overlapY <= 0) {
				return '';
			}
			
			if (overlapX < overlapY) {
				if (c1X - c2X <= 0) {
					return 'left';
				}
				return 'right';
			}
			else {
				if (c1Y - c2Y <= 0) {
					return 'top';
				}
				return 'bottom';
			}
		}

		return that;
	}

	square.createCircleCollisionManager = function(boxCollisionManager) {
		var that = {};

		that.circleWithBoxCollision = function(obj1, obj2) {
			var region1 = obj2.isInVoronoiRegion1(obj1);
			if (region1 === true) {
				var vertex = square.createPosition({x : obj1.position.x, y : obj1.position.y});
				var dX = Math.abs(obj2.position.x - vertex.x);
				var dY = Math.abs(obj2.position.y - vertex.y);

				if (dX < obj2.radius && dY < obj2.radius) {
					return 'bottom';
				}
			}
			else {
				var region2 = obj2.isInVoronoiRegion2(obj1);
				if (region2 === true) {
					var vertex = square.createPosition({x : obj1.position.x + obj1.width, y : obj1.position.y});
					var dX = Math.abs(obj2.position.x - vertex.x);
					var dY = Math.abs(obj2.position.y - vertex.y);

					if (dX < obj2.radius && dY < obj2.radius) {
						return 'bottom';
					}
				}
				else {
					var region3 = obj2.isInVoronoiRegion3(obj1);
					if (region3 === true) {
						var vertex = square.createPosition({x : obj1.position.x + obj1.width, y : obj1.position.y + obj1.width});
						var dX = Math.abs(obj2.position.x - vertex.x);
						var dY = Math.abs(obj2.position.y - vertex.y);

						if (dX < obj2.radius && dY < obj2.radius) {
							return 'top';
						}
					}
					else {
						var region4 = obj2.isInVoronoiRegion4(obj1);
						if (region4 === true) {
							var vertex = square.createPosition({x : obj1.position.x, y : obj1.position.y + obj1.width});
							var dX = Math.abs(obj2.position.x - vertex.x);
							var dY = Math.abs(obj2.position.y - vertex.y);

							if (dX < obj2.radius && dY < obj2.radius) {
								return 'top';
							}
						}
						else {
							return boxCollisionManager.boxWithBoxCollision(obj1, obj2);
						}
					}
				}
			}
			
			return '';
		}

		return that;
	}

	square.createTriangleCollisionManager = function() {
		var that = {};

		that.triangleWithBoxCollision = function(box, triangle) {
			var directionVector = null;
			var positionToCheck1 = null;
			var positionToCheck2 = null;
			var projectedOverlap = false;

			if (triangle.center.position.x > box.getCenterPositionX()) {
				directionVector = triangle.directionVector1;
				positionToCheck1 = box.position;
				positionToCheck2 = square.createPosition({x : box.position.x + box.width, y : box.position.y + box.height});
				position1 = triangle.getProjectedVector(positionToCheck1, directionVector);
				position2 = triangle.getProjectedVector(positionToCheck2, directionVector);
				projectedOverlap = position2.x > triangle.commonVertex.x && position2.y > triangle.commonVertex.y;
			}
			else {
				directionVector = triangle.directionVector2;
				positionToCheck1 = square.createPosition({x : box.position.x, y : box.position.y + box.height});
				positionToCheck2 = square.createPosition({x : box.position.x + box.width, y : box.position.y});
				position1 = triangle.getProjectedVector(positionToCheck1, directionVector);
				position2 = triangle.getProjectedVector(positionToCheck2, directionVector);
				projectedOverlap = position1.x < triangle.commonVertex.x && position1.y > triangle.commonVertex.y;
			}
			
			var widthOverlap = triangle.position.x < box.position.x + box.width;
			//var heightOverlap = triangle.position.y < box.position.y + box.height;

			// var c1X = box.getCenterPositionX();
			// var c2X = triangle.base.x;

			// var overlapX = (box.halfWidth + (triangle.width / 2)) - Math.abs(c1X - c2X); // distance entre les centres en X

			var c1Y = box.getCenterPositionY();
			var c2Y = triangle.base.y;

			var overlapY = (box.halfHeight + (triangle.height / 2)) - Math.abs(c1Y - c2Y); // distance entre les centres en 
			var heightOverlap = overlapY > 0;

			if (projectedOverlap && widthOverlap && heightOverlap) {
				return 'left';
			}
			return '';
		}

		return that;
	}

	square.getCollisionManager = function() {
		var that = {};
		var borderObjects = [];
		var hashBehaviours = [];
		var borderCollisionManager;
		var boxCollisionManager = square.createBoxCollisionManager();
		var circleCollisionManager = square.createCircleCollisionManager(boxCollisionManager);
		var triangleCollisionManager = square.createTriangleCollisionManager();

		function createBehaviour(spec) {
			var that = {};

			that.collisionObjects = spec.collisionObjects;
			that.callback = spec.callback;
			that.isForBorder = spec.isForBorder;

			return that;
		}

		function overlap(obj1, obj2) {
			if (obj2.type === 'circle') {
				return circleCollisionManager.circleWithBoxCollision(obj1, obj2);
			}
			else if (obj2.type === 'triangle') {
				return triangleCollisionManager.triangleWithBoxCollision(obj1, obj2);
			}
			else {
				return boxCollisionManager.boxWithBoxCollision(obj1, obj2);
			}
		}

		that.setBorderCollisionModeOn = function(activeBorder) {
			if (activeBorder) {
				var borderInfo = {};

				borderInfo.minX = 0;
				borderInfo.x = sceneWidth;
				borderInfo.minY = 0;
				borderInfo.y = sceneHeight;

				borderCollisionManager = square.createBorderCollisionManager(borderInfo);
			}
		}

		that.getCollisionBorderInformation = function(obj) {
			if (borderCollisionManager) {
				if (borderCollisionManager.isCollidingOnBorderRight(obj)) {
					return 'borderRight';
				} 
				if (borderCollisionManager.isCollidingOnBorderLeft(obj)) {
					return 'borderLeft';
				}
				if (borderCollisionManager.isCollidingOnGround(obj)) {
					return 'borderBottom';
				} 
				if (borderCollisionManager.isCollidingOnTop(obj)) {
					return 'borderTop';
				} 
			}

			return '';
		}

		that.getCollisionObjectInformation = function(obj1, obj2) {
			return overlap(obj1, obj2);
		}	

		that.check = function(obj) {
			var self = this;
			var details;
			var currentCObj = findInHashBehaviours(obj);

			if (currentCObj) {
				var info = '';
				currentCObj.behaviours.forEach(function(behaviour) {
					if (!behaviour.isForBorder) {
						behaviour.collisionObjects.forEach(function(collisioner) {
							if (collisioner.isVisible) {
								info = self.getCollisionObjectInformation(obj, collisioner);
								if (info !== '') {
									behaviour.callback(
									{
										collisioner : collisioner,
										where : info
									});
								}
							}
						});
					}
					else {
						info = self.getCollisionBorderInformation(obj);
						if (info !== '' && behaviour.callback) {
							behaviour.callback(
							{
								where : info
							});
						}
					}
				});
			}
		}

		that.registerBehaviourForBorder = function(behaviour) {
			var b = findInHashBehaviours(behaviour.subject);
			if (!b) {
				b = {};
				b = behaviour.subject;
				b.behaviours = [];
				hashBehaviours.push(b);
			}

			b.behaviours.push(createBehaviour({collisionObjects : [], callback : behaviour.callback, isForBorder : true}));
		}

		var findInHashBehaviours = function(obj) {
			var behaviour = null;
			for(var i = 0; i < hashBehaviours.length; i++) {
				if(hashBehaviours[i].id === obj.id) {
					behaviour = hashBehaviours[i];
					break;
				}
			}

			return behaviour;
		}

		that.registerBehaviour = function(behaviour) {
			var b = findInHashBehaviours(behaviour.subject);
			if(!b) {
				b = {};
				b = behaviour.subject;
				b.behaviours = [];
				hashBehaviours.push(b);
			}

			b.behaviours.push(createBehaviour({collisionObjects : behaviour.objects, callback : behaviour.callback, isForBorder : false}));
		}

		return that;
	}

	return square;
}(SQUARE || {}))