define(['physicsjs', 'shape/rectangle'], function(Physics, rectangle) {
	var scene = function(world, width, height) {
		var that = {};
		var bounds = Physics.aabb(0, 0, width, height);

		that.shape = {
          add : { 
            rectangle : function(spec){
              var rect = rectangle(spec);
              world.add(rect);
              return rect;
            }
          },
          gravity : {
          	enable : function(shape) {
          		var accel = Physics.behavior('constant-acceleration').applyTo([shape]);
				world.add(accel);
          	}
          },
          bounds : {
          	collision : {
          		enable : function(shape, restitution) {
          			var collide = Physics.behavior('edge-collision-detection', {
	          			aabb: bounds,
	          			restitution: restitution
	          		}).applyTo([shape]);

	          		var impulse = Physics.behavior('body-impulse-response').applyTo([shape]);

	          		world.add(collide);
	          		world.add(impulse);
          		}
          	}
          },
          collision : {
	          	add : function(shape1, shape2, restitution) {
	          		var collide = Physics.behavior('edge-collision-detection', {
	          			aabb: Physics.aabb(shape2.x, shape2.y, shape2.width, shape2.height),
	          			restitution: restitution
	          		}).applyTo([shape1]);

	          		var impulse = Physics.behavior('sweep-prune').applyTo([shape1]);

	          		world.add(collide);
	          		world.add(impulse);
	          	}
	          }
        };

        that.collision = {
        	enable : function() {
		        world.add( Physics.behavior('body-collision-detection') );
        	}
        }

        that.render = function() {
        	world.render();
      	}

      	that.add = function(shape) {
        	world.add(shape);
      	}

      	that.gravity = {
      		enable : function() {
				world.add(Physics.behavior('constant-acceleration'));
      		}
      	};

      	that.bounds = {
	      	collide : function(restitution) {
      			world.add( Physics.behavior('edge-collision-detection', {
		            aabb: bounds,
		            restitution: restitution
		        }));
	      	}
	      }

        return that;
	}
	return scene;
})