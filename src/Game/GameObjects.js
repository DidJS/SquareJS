var SQUARE = (function(square) {
	square.createPosition = function(spec) {
		var that = {};

		that.x = spec.x;
		that.y = spec.y;

		return that;
	}

 	square.createGameObject = function(spec) {
		var that = {};
		var collisionObjects = [];

		that.id = spec.id || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		that.position = this.createPosition({x : spec.x, y : spec.y});
		that.fillStyle = spec.fillStyle || '#000000';
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

	square.createBox = function(spec) {
		var that = this.createGameObject(spec);
		
		that.width = spec.width;
		that.height = spec.height;
		that.halfWidth = that.width / 2;
		that.halfHeight = that.height / 2;

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