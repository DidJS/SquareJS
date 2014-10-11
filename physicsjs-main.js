require.config({
    baseUrl: 'core/',
    // ...
    packages: [
        {
          name: 'physicsjs',
          location: 'lib/',
          main: 'physicsjs-full-0.6.0.min'
        },
        {
          name: 'domReady',
          location: 'lib/',
          main: 'domReady'
        }
    ]
});

require(['domReady', 'physicsjs'], function (domReady, Physics) {
  domReady(function () {
    Physics(function( world ){
        var renderer = Physics.renderer('canvas', {
            el: 'viewport', // id of the canvas element
            width: 500,
            height: 500
        });

        world.add( renderer );

        var square = Physics.body('rectangle', {
            x: 0,
            y: 0,
            vx: 0.01,
            width: 50,
            height: 50
        });
        world.add( square );

        var square2 = Physics.body('rectangle', {
            x: 0,
            y: 300,
            width: 70,
            height: 20
        });
        world.add( square2 );

        Physics.util.ticker.on(function(time, dt) {
            world.step(time);
        })

        var b = Physics.behavior('constant-acceleration').applyTo([square]);
        world.add( b);

        var bounds = Physics.aabb(0, 0, 400, 360);

        world.add( Physics.behavior('edge-collision-detection', {
            aabb: bounds,
            restitution: 0.3
        }) );
        // ensure objects bounce when edge collision is detected
        world.add( Physics.behavior('body-impulse-response') );

        var t = Physics.behavior('edge-collision-detection', {
            aabb: Physics.aabb(300, 400, 20, 470), //Physics.aabb(0, 400, 70, 20),
            restitution: 0.1
        }).applyTo([square]);
        world.add(t);
        b = Physics.behavior('sweep-prune').applyTo([square]);
        world.add(b);

        // world.add( Physics.body('convex-polygon', {
        //     x: 250,
        //     y: 50,
        //     vx: 0.05,
        //     vertices: [
        //         {x: 0, y: 80},
        //         {x: 60, y: 40},
        //         {x: 60, y: -40},
        //         {x: 0, y: -80}
        //     ]
        // }) );

        // world.add( Physics.body('convex-polygon', {
        //     x: 400,
        //     y: 200,
        //     vx: -0.02,
        //     vertices: [
        //         {x: 0, y: 80},
        //         {x: 80, y: 0},
        //         {x: 0, y: -80},
        //         {x: -30, y: -30},
        //         {x: -30, y: 30}
        //     ]
        // }) );

        // world.add( Physics.behavior('body-collision-detection') );
        // world.add( Physics.behavior('sweep-prune') );

        Physics.util.ticker.start();
        world.on('step', function() {
          world.render();
        })
        
      });
  });
});

