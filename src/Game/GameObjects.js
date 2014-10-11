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
		that.fillStyle = spec.fillStyle || 'none';
		that.velX = spec.velX || 0;
		that.velY = spec.velY || 0;
		that.gravity = spec.gravity || 0;
		that.isVisible = true;
		if (spec.isVisible === false) {
			that.isVisible = false;
		}

		that.renderer = function(renderer) {

		}

		return that;
	}

	square.createRectangle = function(spec) {
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

		var renderer = this.createRectangleRenderer(that);
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