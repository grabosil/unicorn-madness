if ( typeof window.GameJam === 'undefined') {
	var GameJam = {};
};


GameJam.Boot = function(game){
	this.preload = function() {
		
	};

	this.create = function() {
		game.stage.backgroundColor = '#01CC01';
		game.state.start('load');
	};
};