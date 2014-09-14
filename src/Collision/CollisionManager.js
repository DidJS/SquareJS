var SQUARE = (function(square) {
	square.getCollisionManager = function() {
		var that = {};
		var borderInfo;
		var borderObjects = [];
		var hashBehaviours = [];

		function createBehaviour(spec) {
			var that = {};

			that.collisionObjects = spec.collisionObjects;
			that.callback = spec.callback;
			that.isForBorder = spec.isForBorder;

			return that;
		}

		function isCollidingOnBorderLeft(obj) {
			if (borderInfo) {
				return obj.position.x < borderInfo.minX;
			}
			
			return false;
		};

		function isCollidingOnBorderRight(obj) {
			if (borderInfo) {
				return obj.position.x + obj.width > borderInfo.x;
			}
			
			return false;
		};

		function isCollidingOnGround(obj) {
			if (borderInfo) {
				return obj.position.y + obj.height > borderInfo.y;
			}
			
			return false;
		};

		function boxCollision(obj1, obj2) {
			var c1X = obj1.position.x + obj1.halfWidth;
			var c2X = obj2.position.x + obj2.halfWidth;

			var overlapX = (obj1.halfWidth + obj2.halfWidth) - Math.abs(c1X - c2X); // distance entre les centres en X

			var c1Y = obj1.position.y + obj1.halfHeight;
			var c2Y = obj2.position.y + obj2.halfHeight;

			var overlapY = (obj1.halfHeight + obj2.halfHeight) - Math.abs(c1Y - c2Y); // distance entre les centres en Y

			if (overlapX <= 0 || overlapY <= 0) {
				return '';
			}
			
			if (overlapX < overlapY) {
				if (c1X - c2X < 0) {
					return 'left';
				}
				return 'right';
			}
			else {
				if (c1Y - c2Y < 0) {
					return 'top';
				}
				return 'bottom';
			}
		}

		function circleWithBoxCollision(obj1, obj2) {
			var region1 = obj2.isInVoronoiRegion1(obj1);
			var region2 = obj2.isInVoronoiRegion2(obj1);
			var region3 = obj2.isInVoronoiRegion3(obj1);
			var region4 = obj2.isInVoronoiRegion4(obj1);

			if (region2 === true) {
				var vertex = square.createPosition({x : obj1.position.x + obj1.width, y : obj1.position.y});
				var dX = Math.abs(obj2.position.x - vertex.x);
				var dY = Math.abs(obj2.position.y - vertex.y);

				if (dX < obj2.radius && dY < obj2.radius) {
					return 'bottom';
				}
			}
			else if (region1 === true) {
				var vertex = square.createPosition({x : obj1.position.x, y : obj1.position.y});
				var dX = Math.abs(obj2.position.x - vertex.x);
				var dY = Math.abs(obj2.position.y - vertex.y);

				if (dX < obj2.radius && dY < obj2.radius) {
					return 'bottom';
				}
			}
			else if (region3 === true) {
				var vertex = square.createPosition({x : obj1.position.x + obj1.width, y : obj1.position.y + obj1.width});
				var dX = Math.abs(obj2.position.x - vertex.x);
				var dY = Math.abs(obj2.position.y - vertex.y);

				if (dX < obj2.radius && dY < obj2.radius) {
					return 'top';
				}
			}
			else if (region4 === true) {
				var vertex = square.createPosition({x : obj1.position.x, y : obj1.position.y + obj1.width});
				var dX = Math.abs(obj2.position.x - vertex.x);
				var dY = Math.abs(obj2.position.y - vertex.y);

				if (dX < obj2.radius && dY < obj2.radius) {
					return 'top';
				}
			}
			else {
				return boxCollision(obj1, obj2);
			}

			return '';
		}

		function overlap(obj1, obj2) {
			if (obj2.type === 'circle') {
				return circleWithBoxCollision(obj1, obj2);
			}
			else {
				return boxCollision(obj1, obj2);
			}
		}

		that.setBorderCollisionModeOn = function(activeBorder) {
			if (activeBorder) {
				borderInfo = {};

				borderInfo.minX = 0;
				borderInfo.x = sceneWidth;
				borderInfo.minY = 0;
				borderInfo.y = sceneHeight;
			}
			else {
				delete borderInfo;
			}
		}


		that.getCollisionBorderInformation = function(obj) {
			
			if (isCollidingOnBorderRight(obj)) {
				return 'borderRight';
			} 
			if (isCollidingOnBorderLeft(obj)) {
				return 'borderLeft';
			}
			if (isCollidingOnGround(obj)) {
				return 'borderBottom';
			} 

			return '';
		}

		that.getCollisionObjectInformation = function(obj1, obj2) {
			return overlap(obj1, obj2);
		}	

		that.getCollisionInformation = function(obj1, obj2) {
			var borderInfo = this.getCollisionBorderInformation(obj1);
			if (borderInfo === '') {
				return this.getCollisionObjectInformation(obj1, obj2);
			}

			return borderInfo;
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