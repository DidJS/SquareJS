define(['physicsjs'], function(Physics) {
	var that = function(spec) {
		var square = Physics.body('rectangle', {
	        x: spec.x,
	        y: spec.y,
	        vx: spec.velX,
	        width: spec.width,
	        height: spec.height
	    });

	    return square;
	};

	return that;
})