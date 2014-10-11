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

	square.createPolyfillCollisionManager = function() {
		var that = {};

		function support(shape1, shape2, directionVector) {
			var p1 = shape1.getFartherPointFromDirection(directionVector);
			var p2 = shape2.getFartherPointFromDirection(square.createPosition({x : -directionVector.x, y : -directionVector.y}));

			// Minkowski difference
			var p3 = square.createPosition({x : p1.x - p2.x, y : p1.y - p2.y});

			return p3;
		}

		function containsOrigin(simplex, directionVector) {
			var indexb = 1;
			var indexc = 0;
			// Get the last point added to the simplex
			var a = simplex[simplex.length - 1];

			// Compute AO : same as -A
			var ao = square.createPosition({x : -a.x, y : -a.y});

			// If triangle
			if (simplex.length === 3) {
				// get b and c
				var b = simplex[indexb];
				var c = simplex[indexc];

				var ab = square.createPosition({x : b.x - a.x, y : b.y - a.y});
				var ac = square.createPosition({x : c.x - a.x, y : c.y - a.y});

				// direction perpendicular to AB
				directionVector = square.createPosition({x : -ab.y, y : ab.x});

				// away from C
				// if same direction, make directionVector opposite
				if (directionVector.dot(c) > 0) {
					directionVector.negate();
				}

				if (directionVector.dot(ao) > 0) {
					simplex.splice(indexc, 1); // remove C
					indexb -= 1;
					return { ok : false, directionVector : directionVector};
				}

				var oldDirectionVector = square.createPosition({x : -directionVector.y, y : directionVector.x});
				// direction to be perpendicular to AC
				directionVector = square.createPosition({x : -ac.y, y : ac.x});

				if (directionVector.dot(b) > 0) {
					directionVector.negate();
				}

				if (directionVector.dot(ao) > 0) {
					simplex.splice(indexb, 1); //
					return {ok : false, directionVector : directionVector};
				}

				return {ok : true, directionVector : directionVector}; // origin is in triangle, this is the simplex
			}
			else { // this is the line segment
				var b = simplex[0];
				var ab = square.createPosition({x : b.x - a.x, y : b.y - a.y});

				directionVector = square.createPosition({x : -ab.y, y : ab.x});

				if (directionVector.dot(ao) > 0) {
					directionVector.negate();
				}
			}

			return {ok : false, directionVector : directionVector};
		}

		return that;
	}

	square.createBoxCollisionManager = function() {
		var that = {};

		that.boxWithBoxCollision = function(obj1, obj2) {
			var c1X = obj1.getCenterPositionX();
			var c2X = obj2.getCenterPositionX();
			var c1Y = obj1.getCenterPositionY();
			var c2Y = obj2.getCenterPositionY();

			var normal = square.createPosition({x : (c1X - c2X), y : (c1Y - c2Y)});

			var overlapX = (obj1.halfWidth + obj2.halfWidth - Math.abs(normal.x)); // distance entre les centres en X
			
			if (overlapX > 0) {
				var overlapY = (obj1.halfHeight + obj2.halfHeight - Math.abs(normal.y)); // distance entre les centres en Y
				if (overlapY > 0) {
					if (overlapX < overlapY) {
						if (normal.x < 0) {
							return 'left';
						}
						return 'right';
					}
					else {
						if (normal.y < 0) {
							return 'top';
						}
						return 'bottom';
					}
				}
			}

			return '';
			
		}

		return that;
	}

	square.createCircleCollisionManager = function(boxCollisionManager) {
		var that = {};

		function isInVoronoiRegion1(box, circle) {
			return circle.position.x < box.position.x && circle.position.y < box.position.y;
		}

		function isInVoronoiRegion2(box, circle) {
			return circle.position.x > box.position.x + box.width && circle.position.y < box.position.y;
		}

		function isInVoronoiRegion3(box, circle) {
			return circle.position.x > box.position.x + box.width && circle.position.y > box.position.y + box.height;
		}

		function isInVoronoiRegion4(box, circle) {
			return circle.position.x < box.position.x && circle.position.y > box.position.y + box.height;
		}

		that.circleWithBoxCollision = function(box, circle) {
			var region1 = isInVoronoiRegion1(box, circle);
			if (region1 === true) {
				var vertex = square.createPosition({x : box.position.x, y : box.position.y});
				var dX = Math.abs(circle.position.x - vertex.x);
				var dY = Math.abs(circle.position.y - vertex.y);

				if (dX < circle.radius && dY < circle.radius) {
					return 'bottom';
				}
			}
			else {
				var region2 = isInVoronoiRegion2(box, circle);
				if (region2 === true) {
					var vertex = square.createPosition({x : box.position.x + box.width, y : box.position.y});
					var dX = Math.abs(circle.position.x - vertex.x);
					var dY = Math.abs(circle.position.y - vertex.y);

					if (dX < circle.radius && dY < circle.radius) {
						return 'bottom';
					}
				}
				else {
					var region3 = isInVoronoiRegion3(box, circle);
					if (region3 === true) {
						var vertex = square.createPosition({x : box.position.x + box.width, y : box.position.y + box.width});
						var dX = Math.abs(circle.position.x - vertex.x);
						var dY = Math.abs(circle.position.y - vertex.y);

						if (dX < circle.radius && dY < circle.radius) {
							return 'top';
						}
					}
					else {
						var region4 = isInVoronoiRegion4(box, circle);
						if (region4 === true) {
							var vertex = square.createPosition({x : box.position.x, y : box.position.y + box.width});
							var dX = Math.abs(circle.position.x - vertex.x);
							var dY = Math.abs(circle.position.y - vertex.y);

							if (dX < circle.radius && dY < circle.radius) {
								return 'top';
							}
						}
						else {
							return boxCollisionManager.boxWithBoxCollision(box, circle);
						}
					}
				}
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
			else {
				return boxCollisionManager.boxWithBoxCollision(obj1, obj2);
			}
		}

		that.setBorderCollisionModeOn = function(activeBorder, minX, minY, maxX, maxY) {
			if (activeBorder) {
				var borderInfo = {};

				borderInfo.minX = minX;
				borderInfo.x = maxX;
				borderInfo.minY = minY;
				borderInfo.y = maxY;

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
								else {
									collisioner.collisionTop = false;
									collisioner.collisionBottom = false;
									collisioner.collisionRight = false;
									collisioner.collisionLeft = false;
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