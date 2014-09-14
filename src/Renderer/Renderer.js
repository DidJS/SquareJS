var SQUARE = (function(square) {
	square.createRenderer = function(id) {
		var canvas = document.getElementById(id);
		var context = canvas.getContext('2d');
		
		var that = {};

		that.render = function(scene) {
			context.clearRect(0, 0, canvas.width, canvas.height);

			for(var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].isVisible) {
					scene.children[i].velY += scene.children[i].gravity;

					scene.children[i].position.x += scene.children[i].velX;
					scene.children[i].position.y += scene.children[i].velY;

					scene.check(scene.children[i]);
					scene.children[i].render(context);
				}
			}
		}

		return that;
	}

	return square;
}(SQUARE || {}));