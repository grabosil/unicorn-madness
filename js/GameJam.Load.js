if ( typeof window.GameJam === 'undefined') {
	var GameJam = {};
};

GameJam.Boot = function(game){
	this.game = game;

	this.preload = function() {
//		label2 = game.add.text(300, window.innerHeight/2, 'LOADING', {
//			font: '60px Roboto',
//			fill: '#BBF1BB'
//		});
//		label2.anchor.setTo(0.5, 0.5);
	};

	this.create = function() {
//		console.log("STAGE: " +game.stage.bounds.width);
//		setTimeout(function() {
			game.state.start('menu');
//		}, 1000);
	};
};