if(typeof window.GameJam === 'undefined'){
	var GameJam = {};
};

GameJam.Loader = function(params){
	var game = null;
	var w = window.innerWidth * window.devicePixelRatio;
    var h = window.innerHeight * window.devicePixelRatio;
    var player = null;
    var cursor;
    var platforms;
	
	var _run = function(params){
		game = new Phaser.Game(w, h, Phaser.CANVAS, '',{preload: preload, create: create, update:update, render: render});

		
		function preload(){
			game.load.image('player','assets/diamond.png');
			game.load.image('block','assets/platform.png');
		};
		
		
		function create() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.world.setBounds(0, 0, 140000, h);
			
			
			for (var i = 0; i < 100; i++){
				addBlock(Math.floor(Math.random()*140000)+1, 10);
			}
			platforms = game.add.group();
			platforms.enableBody = true;
			var ground = platforms.create(0, game.world.height-32, 'block');
			ground.body.immovable = true;
			
			player = createPlayer();
			
			game.camera.follow(player);

			cursors = game.input.keyboard.createCursorKeys();
		};

		function update(){
			game.physics.arcade.collide(player, platforms);
			player.body.velocity.x = 0;
			 
		    if (cursors.left.isDown)
		    {
		        //  Move to the left
		        player.body.velocity.x = -150;
		 
		    }
		    else if (cursors.right.isDown)
		    {
		        //  Move to the right
		        player.body.velocity.x = 150;
		 
		    }
		    else
		    {
		 
		    }
		    
		    //  Allow the player to jump if they are touching the ground.
		    if (cursors.up.isDown && player.body.touching.down)
		    {
		        player.body.velocity.y = -350;
		    }
			
		};
		
		function createPlayer(){
			var playerTmp = game.add.sprite(30,game.world.height-200,'player');
			game.physics.arcade.enable(playerTmp);
			playerTmp.anchor.setTo(0.5,0.5);
			playerTmp.body.collideWorldBounds = true;
			playerTmp.body.bounce.y = 0.2;
			playerTmp.body.gravity.y = 700;
			return playerTmp;
		};
		
		function addBlock(x,y){
			game.add.sprite(x,y, 'block');
			
		}
		
		function render(){
			game.debug.cameraInfo(game.camera, 32, 32);
			game.input.renderDebugInfo(16, 16);
		};
		
	};
	
	
	
	_run(params);
};

