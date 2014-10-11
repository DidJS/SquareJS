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

define(['domReady', 'physicsjs', 'Game/scene'], function (domReady, Physics, scene) {
    var game = function(view, width, height, ready) {
      var that = {};
      
      domReady(function () {
          var world = Physics();

          var innerscene = scene(world, width, height);

          var renderer = Physics.renderer('canvas', {
              el: view, // id of the canvas element
              width: width,
              height: height
          });

          world.add(renderer);

          Physics.util.ticker.on(function(time, dt) {
              world.step(time);
          });

          Physics.util.ticker.start();

          world.on('step', function() {
            innerscene.render();
          })

          ready(innerscene);
       
      });
      
    return that;
   
  }
  return {game : game};
})