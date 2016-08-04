if ( typeof window.GameJam === 'undefined') {
	var GameJam = {};
};

GameJam.Loader2 = function(params) {
	var game = null;
	var w = window.innerWidth;
	var h = window.innerHeight;
	
	var _run = function(params) {
		game = new Phaser.Game(w, h, Phaser.CANVAS, '');
		game.state.add('boot', GameJam.Boot);
		game.state.add('load', GameJam.Load);
		game.state.add('menu', GameJam.Menu);
		game.state.add('play', GameJam.Play);

		game.state.start('boot');
		
		if(params && params.newLevel){
			game.state.start('play');
		};
		
	};

	_run(params);
};

