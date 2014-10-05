var SQUARE = (function(square) {
	square.createPosition = function(spec) {
		var that = {};

		that.x = spec.x;
		that.y = spec.y;

		that.dot = function(vector) {
			return this.x * vector.x + this.y * vector.y;
		}

		that.negate = function() {
			this.x = -this.x;
			this.y = -this.y;

			return this;
		}

		return that;
	}

 	square.createGameObject = function(spec) {
		var that = {};
		var collisionObjects = [];

		that.id = spec.id || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		that.position = this.createPosition({x : spec.x, y : spec.y});
		that.oldPosition = this.createPosition({x : spec.x, y : spec.y});
		that.fillStyle = spec.fillStyle || 'none';
		that.velX = spec.velX || 0;
		that.velY = spec.velY || 0;
		that.gravity = spec.gravity || 0;
		that.isVisible = true;
		that.collisionTop = false;
		that.collisionBottom = false;
		that.collisionLeft = false;
		that.collisionRight = false;
		if (spec.isVisible === false) {
			that.isVisible = false;
		}

		that.renderer = function(renderer) {

		}

		return that;
	}

	square.createBox = function(spec) {
		var that = this.createGameObject(spec);
		
		that.width = spec.width;
		that.height = spec.height;
		that.halfWidth = that.width / 2;
		that.halfHeight = that.height / 2;

		that.getFartherPointFromDirection = function(directionVector) {
			var points = [];
			var point1 = square.createPosition({x : that.position.x + that.width, y : that.position.y});
			var point2 = square.createPosition({x : that.position.x, y : that.position.y + that.height});
			var point3 = square.createPosition({x : that.position.x + that.width, y : that.position.y + that.height});
			points.push(that.position);
			points.push(point1);
			points.push(point2);
			points.push(point3);

			var index = 0;
			var maxDot = points[index].dot(directionVector);

			for (var i = 1; i < points.length; i++) {
				var dot = points[i].dot(directionVector);

				if (dot > maxDot) {
					maxDot = dot;
					index = i;
				}
			}

			return points[index];
		}

		that.getMax = function() {
			return square.createPosition({x : this.position.x + this.width, y : this.position.y + this.height});
		}

		that.getCenterPositionX = function() {
			return this.position.x + this.halfWidth;
		}

		that.getCenterPositionY = function() {
			return this.position.y + this.halfHeight;
		}

		var renderer = this.createBoxRenderer(that);
		that.render = function(context) {
			renderer.render(context);
		}

		return that;
	}

	square.createTriangle = function(spec) {
		// spec.x = spec.vertex1.x;
		// spec.y = spec.vertex1.y;

		var that = this.createGameObject(spec);
		that.type = 'triangle';
		that.mode = spec.mode;

		that.vertex1 = this.createPosition(spec.vertex1);
		that.vertex2 = this.createPosition(spec.vertex2);
		that.vertex3 = this.createPosition(spec.vertex3);
		
		that.lengthV1V2 = {v1 : spec.vertex1, v2 : spec.vertex2, length : Math.sqrt((spec.vertex2.x - spec.vertex1.x) * (spec.vertex2.x - spec.vertex1.x) + ((spec.vertex2.y - spec.vertex1.y) * (spec.vertex2.y - spec.vertex1.y)))};
		that.lengthV1V3 = {v1 : spec.vertex1, v2 : spec.vertex3, length : Math.sqrt((spec.vertex3.x - spec.vertex1.x) * (spec.vertex3.x - spec.vertex1.x) + ((spec.vertex3.y - spec.vertex1.y) * (spec.vertex3.y - spec.vertex1.y)))};
		that.lengthV2V3 = {v1 : spec.vertex2, v2 : spec.vertex3, length : Math.sqrt((spec.vertex3.x - spec.vertex2.x) * (spec.vertex3.x - spec.vertex2.x) + ((spec.vertex3.y - spec.vertex2.y) * (spec.vertex3.y - spec.vertex2.y)))};

		that.directionVector1 = null;
		that.directionVector2 = null;
		that.commonVertex = null;

		(function() {
			var tabLength = [];

			tabLength.push(that.lengthV1V2);
			tabLength.push(that.lengthV1V3);
			tabLength.push(that.lengthV2V3);


			function getIndexBase(tab) {
				var index = 0;

				if (that.lengthV1V2.length === that.lengthV2V3.length) {
					index = 1;
				}
				
				if (that.lengthV1V2.length === that.lengthV1V3.length) {
					index = 2;
				} 

				return index;
			}
			
			var index = getIndexBase(tabLength);
			that.base = square.createPosition({x : spec.x, y : spec.y});

			tabLength.splice(index, 1);

			var countCommonVertices = [];

			function findVertex(vertex) {
				var foundVertex = null;
				for (var i = 0; i < countCommonVertices.length; i++) {
					if (countCommonVertices[i].vertex === vertex) {
						foundVertex = countCommonVertices[i];
						break;
					}
				}
				return foundVertex;
			}

			for (var i = 0; i < tabLength.length; i++) {
				var vertex = findVertex(tabLength[i].v1);
				if (vertex === null) {
					countCommonVertices.push({vertex : tabLength[i].v1, count : 1});
				}
				else {
					vertex.count++;
				}

				vertex = findVertex(tabLength[i].v2);
				if (vertex === null) {
					countCommonVertices.push({vertex : tabLength[i].v2, count : 1});
				}
				else {
					vertex.count++;
				}
			}

			var maxCountVertex = countCommonVertices[0].count;

			for (var i = 0; i < countCommonVertices.length; i++) {
				if (maxCountVertex < countCommonVertices[i].count) {
					maxCountVertex = countCommonVertices[i].count;
					that.commonVertex = countCommonVertices[i].vertex;
				}
			}

			that.directionVector1 = square.createPosition({x : tabLength[0].v2.x - tabLength[0].v1.x, y : tabLength[0].v2.y - tabLength[0].v1.y});
			that.directionVector2 = square.createPosition({x : tabLength[1].v2.x - tabLength[1].v1.x, y : tabLength[1].v2.y - tabLength[1].v1.y});

			that.height = Math.abs(that.base.y - that.commonVertex.y);
			
		})();
		
		that.getProjectedVector = function(initialVector, directionVector) {
			var lambda = (directionVector.x * (initialVector.x - that.commonVertex.x) + directionVector.y * (initialVector.y - that.commonVertex.y)) / (directionVector.x * directionVector.x + directionVector.y * directionVector.y)
			var x = that.commonVertex.x + lambda * directionVector.x;
			var y = that.commonVertex.y + lambda * directionVector.y;

			return square.createPosition({x : x, y : y});
		}

		that.center = {position : square.createPosition({x : (that.vertex1.x + that.vertex2.x + that.vertex3.x) / 3, y : (that.vertex1.y + that.vertex2.y + that.vertex3.y) / 3})};

		var renderer = this.createTriangleRenderer(that);
		that.render = function(context) {
			renderer.render(context);
		}

		return that;
	}

	square.createCircle = function(spec) {
		var that = this.createGameObject(spec);

		that.type = 'circle';
		that.radius = spec.radius;
		that.diameter = spec.radius * 2;

		that.halfWidth = that.radius;
		that.halfHeight = that.radius;

		that.getCenterPositionX = function() {
			return this.position.x;
		}

		that.getCenterPositionY = function() {
			return this.position.y;
		}

		var renderer = this.createCircleRenderer(that);

		that.render = function(context) {
			renderer.render(context);
		}

		that.isInVoronoiRegion1 = function(obj) {
			return this.position.x < obj.position.x && this.position.y < obj.position.y;
		}

		that.isInVoronoiRegion2 = function(obj) {
			return this.position.x > obj.position.x + obj.width && this.position.y < obj.position.y;
		}

		that.isInVoronoiRegion3 = function(obj) {
			return this.position.x > obj.position.x + obj.width && this.position.y > obj.position.y + obj.height;
		}

		that.isInVoronoiRegion4 = function(obj) {
			return this.position.x < obj.position.x && this.position.y > obj.position.y + obj.height;
		}

		return that;
	}

	square.createText = function(spec) {
		var that = this.createGameObject(spec);

		that.text = spec.text;
		that.font = spec.font || 'bold 12px sans-serif';
		that.fontColor = spec.fontColor || '#000000'

		that.getCenterPositionX = function() {
		}

		that.getCenterPositionY = function() {
		}

		var renderer = this.createTextRenderer(that);
		that.render = function(context) {
			renderer.render(context);
		}

		return that;
	}


	return square;
}(SQUARE || {}))