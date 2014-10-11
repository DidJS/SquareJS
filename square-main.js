require(['core/squarejs'], function(square) {
	function createFileLoader(file, callback) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", file);

			xhr.onload = function() {
				if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
		 			resolve(xhr.responseText);
				}
				else {
					reject(Error("An occured while loading file " + file + ". Status : " + xhr.statusText));
				}
			}

			xhr.onerror = function() {
				reject(Error("An occured while loading file " + file + ". Status : " + xhr.statusText));
			}

			xhr.send(); 
		})
	}
	
	square.game('viewport', 400, 360, ready);
	

	function ready(scene) {
		var boxWidth = 20;
		var boxHeight = 20;

		var player;
		var boxes = [];

		player = scene.shape.add.rectangle({id : 'player', x : 30, y : 100, width : 10, height : 10});
		scene.shape.gravity.enable(player);
		scene.shape.bounds.collision.enable(player, 0.1);

		var loader = createFileLoader('level1.txt', null).then(function(response) {
			var level = response.split(/[\r\n]+/);
			for (var y = 0; y < level.length; y++) {
				for (var x = 0; x < level[y].length; x++) {
					if (level[y][x] === 'b') {
						var box = scene.shape.add.rectangle({x : (x * boxWidth), y : y * boxHeight, width : boxWidth, height : boxHeight});
						scene.shape.collision.add(player, {x : (x * boxWidth), y : y * boxHeight, width : boxWidth, height : boxHeight}, 0.1);
					}
				}
			}


			scene.render();
		}, function(error) {
			console.log(error);
		});
		

		// var box = scene.shape.add.rectangle({
  //           x: 50,
  //           y: 50,
  //           width: 50,
  //           height: 50
  //       });

       	

		
	}

})