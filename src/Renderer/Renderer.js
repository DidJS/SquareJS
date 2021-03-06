var SQUARE = (function(square) {
	square.getRenderer = function(id) {
		var canvas = document.getElementById(id);
		var context = canvas.getContext('2d');
		
		var that = {};

		that.render = function(scene) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.rect(0, 0, canvas.width, canvas.height);
			var grd;
			if (scene.backgroundColor.mode === 'horizontal') {
				grd = context.createLinearGradient(0, 0, 0, canvas.height);
			}
			else {
				grd = context.createLinearGradient(0, 0, canvas.width, 0);
			}
	        grd.addColorStop(0, scene.backgroundColor.startingColor);   
	        grd.addColorStop(1, scene.backgroundColor.endingColor);
	        context.fillStyle = grd;
	        context.fill();

			if (!scene.isPaused() && scene.tick) {
				scene.tick();
			}

			for(var i = 0; i < scene.children.length; i++) {
				if (!scene.isPaused() && scene.children[i].isVisible) {

					scene.children[i].position.x += scene.children[i].velX;
					if (scene.children[i].gravity > 0) {
						scene.children[i].velY += scene.children[i].gravity;
						
						scene.children[i].position.y = scene.children[i].position.y + scene.children[i].velY;
					}

					
					scene.check(scene.children[i]);

					
					scene.children[i].render(context);
					
				}
				else {
					if (scene.isPaused() && scene.children[i].isVisible) {
						scene.children[i].render(context);
					}
				}
			}
		}

		return that;
	}

	square.createRectangleRenderer = function(obj) {
		var that = {};

		that.render = function(context) {
			context.beginPath();
			if (obj.fillStyle !== 'none') {
				context.fillStyle = obj.fillStyle;
				context.fillRect(obj.position.x, obj.position.y, obj.width, obj.height);
			}
			else {
				context.rect(obj.position.x, obj.position.y, obj.width, obj.height);
			}
			context.closePath();
			context.stroke();
		}

		return that;
	}

	square.createTriangleRenderer = function(obj) {
		var that = {};

		that.render = function(context) {
			context.beginPath();
		    context.moveTo(obj.position.x, obj.position.y);
		    context.lineTo(obj.vertex1.x, obj.vertex1.y);
		    context.lineTo(obj.vertex2.x, obj.vertex2.y);
		    context.lineTo(obj.vertex3.x, obj.vertex3.y);
		    if (obj.fillStyle !== 'none') {
				context.fillStyle = obj.fillStyle;
				context.fill();
			}
			else {
		    	context.stroke();
			}
		}

		return that;
	}

	square.createTextRenderer = function(obj) {
		var that = {};
		
		that.render = function(context) {
			context.font = obj.font;
			context.fillStyle = obj.fontColor;
			context.fillText(obj.text, obj.position.x, obj.position.y);
		}

		return that;
	}

	square.createCircleRenderer = function(obj) {
		var that = {};

		that.render = function(context) {
			context.beginPath();
		    context.arc(obj.position.x, obj.position.y, obj.radius, 0, 2 * Math.PI, false);
		    context.closePath();
		    if (obj.fillStyle !== 'none') {
			    context.fillStyle = 'green';
			}
			context.fill();
		}

		return that;
	}

	return square;
}(SQUARE || {}));