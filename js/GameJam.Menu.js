if ( typeof window.GameJam === 'undefined') {
	var GameJam = {};
};

GameJam.Menu = function(game){
	this.game = game;
	
	var button, background, credits = null;

	this.preload = function() {
		game.load.image('button', 'backgrounds/menu_button.png');
		game.load.image('credit', 'backgrounds/menu_credits.png');
		game.load.image('background', 'backgrounds/menu_background.jpg');
	};

	this.create = function() {

        background= game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.width, 'background');
        credits = game.add.sprite(game.stage.bounds.width-game.cache.getImage('credit').width, game.stage.bounds.height-100, 'credit');

		button = game.add.button(100, 100, 'button', actionOnClick, this, 2, 1, 0);
		button.scale.setTo(0.7, 0.7);
	};
	
	var actionOnClick = function() {

		game.state.start('play');

	};
};