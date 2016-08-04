if ( typeof window.GameJam === 'undefined') {
	var GameJam = {};
};

GameJam.Play = function(game) {
	var platforms, cursors, player, enemys, laser, wolken, foregroundTrees, backgroundTrees, backgroundHills,backgroundPillows, worldGroup, deadEnemys, bloodGroup, finals, backgroundMap = null;
	var laserShotSound, enemyHitSound, enemyDeathSound = null;
	var h = window.innerHeight;
	var GAME_WORLD_WIDTH = 25000;
	var grasArray = ['', 'gras1', 'gras2', 'gras3', 'gras4', 'gras6', 'gras7'];
	var treeArray = ['', 'steinbaum2', 'steinbaum3', 'afroBlume'];
	var enemyArray = ['', 'enemy1', 'enemy2'];
	var cloudArray = ['', 'cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud5', 'cloud7'];
	var shotDelay = 500;
	var lastShotTime = 0;
	var randomBonus = [];
	var enemyWait = false;
	var waitTimer = 750;
	var waitTime = null;
	var score = 0;

	this.preload = function() {
		for (var i = 1; i < 28; i++) {
			game.load.image('bonus' + i, 'bonus/Bonus_1600x100_' + i + '.jpg');
		}
		for (var i = 1; i < 8; i++) {
			game.load.image('bonusBack' + i, 'backgrounds/bonus/Bonus_Background_1280x600_' + i + '.jpg');
		}
		//load image ressources
		game.load.spritesheet('enemy1', 'assets/enemy_walk.png', 315, 393);
		game.load.spritesheet('enemy2', 'assets/blubb_walk_1942x160.png', 138.7, 160);
		game.load.image('background', 'assets/background_standard_10x600.jpg');
		game.load.image('attack', 'assets/FX_GIF.gif');
		game.load.spritesheet('dude', 'assets/walk_finish.png', 136.6, 256);
		game.load.image('gras1', 'assets/1.jpg');
		game.load.image('gras2', 'assets/2.jpg');
		game.load.image('gras3', 'assets/3.jpg');
		game.load.image('gras4', 'assets/4.jpg');
		game.load.image('gras5', 'assets/5.jpg');
		game.load.image('gras6', 'assets/6.jpg');
		game.load.image('gras7', 'assets/7.jpg');
		game.load.spritesheet('cloud1', 'assets/Cloud_01.png', 450, 173);
		game.load.spritesheet('cloud2', 'assets/Cloud_02.png', 431, 198);
		game.load.spritesheet('cloud3', 'assets/Cloud_03.png', 354, 184);
		game.load.spritesheet('cloud4', 'assets/Cloud_04.png', 333, 198);
		game.load.spritesheet('cloud5', 'assets/Cloud_05.png', 348, 198);
		game.load.spritesheet('cloud7', 'assets/Cloud_07.png', 346, 140);
		game.load.image('blood', 'assets/blood1.png');
		game.load.image('steinbaum1', 'assets/steinbaum_1.png');
		game.load.image('steinbaum2', 'assets/steinbaum_2.png');
		game.load.image('steinbaum3', 'assets/steinbaum_3.png');
		game.load.image('afroBlume', 'assets/AfroBlume_klein.png');
		game.load.spritesheet('laser', 'assets/laser_ani_1044.png', 350, 229);
		game.load.image('hill', 'backgrounds/hills.png');
		//load audio ressources
		game.load.image('final', 'assets/Unicorn_Dame.png');
		game.load.audio('laser_shot', 'sounds/Laser_Shot.mp3');
		game.load.audio('enemy_hit', 'sounds/Enemy_Hit.wav');
		game.load.audio('enemy_death', 'sounds/Enemy_Death.mp3');
		game.load.audio('loop','sounds/loop.wav');
	};

	this.create = function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.setBounds(0, 0, GAME_WORLD_WIDTH, h);
		game.stage.backgroundColor = '#FF007F';
		
		var music = game.add.audio('loop',1,true);
		music.play('',0,1,true);

		background = game.add.tileSprite(0, 0, game.stage.bounds.width + 10, game.stage.bounds.height, 'background');
		background.scale.setTo(1.0, 1.31);

		platforms = game.add.group();
		backgroundMap = game.add.group();

		enemys = game.add.group();

		foregroundTrees = game.add.group();
		backgroundTrees = game.add.group();
		backgroundHills = game.add.group();
		backgroundPillows = game.add.group();
		finals = game.add.group();

		deadEnemys = game.add.group();
		bloodGroup = game.add.group();

		worldGroup = game.add.group();

		lasers = game.add.group();

		laserShotSound = game.add.audio('laser_shot');
		laserShotSound.volume = 0.1;
		enemyHitSound = game.add.audio('enemy_hit');

		enemyDeathSound = game.add.audio('enemy_death');
		enemyDeathSound.volume = 0.1;

		worldGroup.add(backgroundMap);
		worldGroup.add(platforms);
		worldGroup.add(backgroundHills);
		worldGroup.add(backgroundPillows);
		worldGroup.add(foregroundTrees);
		worldGroup.add(backgroundTrees);
		worldGroup.add(bloodGroup);
		worldGroup.add(deadEnemys);
		worldGroup.add(enemys);
		worldGroup.add(lasers);

		lasers.fired = false;

		enemys.enableBody = true;

		platforms.enableBody = true;

		createRandomLevel();
		worldGroup.add(finals);
		worldGroup.add(player);

		game.camera.follow(player);

		showHud();
		cursors = game.input.keyboard.createCursorKeys();
		keyboard = game.input.keyboard;

	};

	this.update = function() {
		//	wolken.x -= 1;
		background.x = game.camera.x;
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(enemys, platforms);
		game.physics.arcade.collide(player, enemys, hitPlayer);
		game.physics.arcade.overlap(laser, enemys, killEnemy, null, this);
		game.physics.arcade.overlap(player, finals, endGame, null, this);
		//game.physics.arcade.collide(enemys, laser);

		enemys.frame = 2;

		player.body.velocity.x = 0;

		if (cursors.left.isDown && !lasers.fired) {
			player.animations.play('left');
			player.body.velocity.x = -500;
			player.flipped = true;

		} else if (cursors.right.isDown && !lasers.fired) {
			player.animations.play('right');
			player.flipped = false;
			player.body.velocity.x = 500;

		} else if (cursors.right.isDown && lasers.fired) {
			player.flipped = false;
			player.animations.play('fire_and_walk_right');
			player.body.velocity.x = 500;
			laser.body.velocity.x = 500;
			laser.position.y = player.position.y - 50;

		} else if (cursors.left.isDown && lasers.fired) {
			player.flipped = true;
			player.animations.play('fire_and_walk_left');
			player.body.velocity.x = -500;
			laser.body.velocity.x = -500;
			laser.position.y = player.position.y - 50;
		} else if (!lasers.fired) {
			player.animations.stop();
			if (player.flipped) {
				player.frame = 3;
			} else {
				player.frame = 11;
			}
		}

		if (cursors.up.isDown && player.body.touching.down) {
			player.body.velocity.y = -550;
		}

		if (keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !lasers.fired && ((game.time.now - lastShotTime) > shotDelay)) {
			if (!lasers.fired) {
				if (player.flipped) {
					player.animations.stop('left');
					player.animations.play('fire_left');
					laser = lasers.create(player.position.x - 120, player.position.y - 50, 'laser');
					laser.scale.setTo(0.75, 0.75);
					laser.animations.add('laser_left', [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2], 30, false);
					laser.animations.play('laser_left', 50, false, true);
					game.physics.arcade.enable(laser);
					laser.anchor.setTo(0.5, 0.5);
					laser.angle += 180;
					laserShotSound.play();
				} else {
					player.animations.stop('right');
					player.animations.play('fire_right');
					laser = lasers.create(player.position.x + 135, player.position.y - 50, 'laser');
					laser.animations.add('laser_right', [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1], 30, false);
					laser.scale.setTo(0.75, 0.75);
					laser.animations.play('laser_right', 50, false, true);
					game.physics.arcade.enable(laser);
					laser.anchor.setTo(0.5, 0.5);
					laserShotSound.play();
				};
				lasers.fired = true;
				lastShotTime = game.time.now;
			}
		}

		if (keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
			if (laser) {
				lasers.fired = false;
			}

		}

		updateEnemys();

		worldGroup.bringToTop(foregroundTrees);
		worldGroup.sendToBack(backgroundTrees);
		worldGroup.sendToBack(backgroundHills);
		worldGroup.sendToBack(backgroundPillows);
		worldGroup.sendToBack(backgroundMap);

		$('#score').html(score);

	};

	var hitPlayer = function(playerHit, enemyAttack) {
		var saveVelo = enemyAttack.body.velocity.x;
		enemyAttack.body.velocity.x = 0;
		enemyWait = true;
		
		var fx = $('<img style="position: absolute; top: 400px ; left: 600px;" src="assets/FX_GIF.gif"></img>');

		$('body').append(fx);
		setTimeout(function(){
			fx.remove();
		}, 500);

		waitTime = game.time.now;
		playerHit.health -= 4;
		if (playerHit.health < 90) {
			$('#heart10').remove();
		}

		if (playerHit.health < 80) {
			$('#heart9').remove();
		}

		if (playerHit.health < 70) {
			$('#heart8').remove();
		}

		if (playerHit.health < 60) {
			$('#heart7').remove();
		}

		if (playerHit.health < 50) {
			$('#heart6').remove();
		}

		if (playerHit.health < 40) {
			$('#heart5').remove();
		}

		if (playerHit.health < 30) {
			$('#heart4').remove();
		}

		if (playerHit.health < 20) {
			$('#heart3').remove();
		}

		if (playerHit.health < 10) {
			$('#heart2').remove();
		}

		if (playerHit.health < 1) {
			$('#heart1').remove();
			playerHit.destroy();
			lasers.destroy();
			showGameOverScreen();
		}

		enemyAttack.animations.play('attack_left');
		console.log(playerHit.health);
	};

	var updateEnemys = function() {
		enemys.forEach(function(enemy) {
			if (enemy && enemy.alife) {
				if (enemyWait && ((game.time.now - waitTime) > waitTimer)) {
					enemy.body.velocity.x = -100;
				}
				if (enemy.position.x - player.position.x < 500 && !player.isInVersusMode) {
					player.isInVersusMode = true;
					showVsScreen(enemy);

				}
				if (enemy.oldX - enemy.position.x > 250 && enemy.oldX != GAME_WORLD_WIDTH) {
					enemy.body.velocity.x = Math.floor((Math.random() * 5) + 1) * 50;
					enemy.animations.play('right');
					enemy.flipped = false;
				} else if (enemy.oldX + 250 < enemy.position.x && enemy.oldX != 0) {
					enemy.body.velocity.x = -(Math.floor((Math.random() * 5) + 1) * 50);
					enemy.animations.play('left');
					enemy.flipped = true;
				}
			}

			if (!enemy.alife) {
				enemy.frame = 3;
			}
		});
	};

	var showVsScreen = function(attackEnemy) {
		game.paused = true;
		var screen = $('<div></div>');
		screen.attr('id', 'versusScreen');
		screen.attr('style', 'position:absolute;z-index: 3; background-image:url(backgrounds/versus1.jpg); height: 100%; width: 100%; background-repeat: no-repeat; background-position: center center;background-size: contain; background-color: black;left:0px;top:0px');
		$('body').append(screen);
		var bam1 = new Audio('sounds/bam1.wav');
		bam1.play();
		setTimeout(function() {
			if (attackEnemy.type == 1) {
				$('#versusScreen').css({
					'position' : 'absolute',
					'backgroundImage' : 'url(backgrounds/versus2.jpg)',
					'zIndex' : 3,
					'height' : '100%',
					'width' : '100%',
					'left' : '0px',
					'top' : '0px',
					'backgroundPosition' : 'center center',
					'backgroundColor' : 'black',
					'backgroundSize' : 'contain',
					'backgroundRepeat' : 'no-repeat'
				});
			} else {
				$('#versusScreen').css({
					'position' : 'absolute',
					'backgroundImage' : 'url(backgrounds/versus2blubb.jpg)',
					'zIndex' : 3,
					'height' : '100%',
					'width' : '100%',
					'left' : '0px',
					'top' : '0px',
					'backgroundPosition' : 'center center',
					'backgroundColor' : 'black',
					'backgroundSize' : 'contain',
					'backgroundRepeat' : 'no-repeat'
				});
			}

			var bam2 = new Audio('sounds/bam2.wav');
			bam2.play();
		}, 500);
		setTimeout(function() {
			if (attackEnemy.type == 1) {
				$('#versusScreen').css({
					'position' : 'absolute',
					'backgroundImage' : 'url(backgrounds/versus3.jpg)',
					'zIndex' : 3,
					'height' : '100%',
					'width' : '100%',
					'left' : '0px',
					'top' : '0px',
					'backgroundPosition' : 'center center',
					'backgroundColor' : 'black',
					'backgroundSize' : 'contain',
					'backgroundRepeat' : 'no-repeat'
				});
			} else {
				$('#versusScreen').css({
					'position' : 'absolute',
					'backgroundImage' : 'url(backgrounds/versus3blubb.jpg)',
					'zIndex' : 3,
					'height' : '100%',
					'width' : '100%',
					'left' : '0px',
					'top' : '0px',
					'backgroundPosition' : 'center center',
					'backgroundColor' : 'black',
					'backgroundSize' : 'contain',
					'backgroundRepeat' : 'no-repeat'
				});
			}
			var bam3 = new Audio('sounds/bam3.wav');
			bam3.play();
		}, 1000);

		setTimeout(function() {
			$('#versusScreen').remove();
			game.paused = false;
			attackEnemy.oldX = 0;
			attackEnemy.body.velocity.x = -750;
			attackEnemy.animations.play('attack_left');
			attackEnemy.flipped = true;
		}, 2000);
	};

	var killEnemy = function(laser, enemy) {
		if (enemy.health == 1) {
			score = score + (Math.floor((Math.random() * 27) + 1) * 100);
			enemy.body.velocity.x = 0;
			enemy.alife = false;
			var saveX = enemy.position.x;
			var saveY = enemy.position.y;
			var saveDirection = enemy.flipped;
			enemyDeathSound.play();
			
			enemy.destroy();

			if (saveDirection) {
					bloodGroup.create(saveX - 40, game.world.height - 128, 'blood');

			} else {
					bloodGroup.create(saveX + 150, game.world.height - 128, 'blood');
			}
			
			var unboundedEnemy = deadEnemys.create(saveX, saveY + 20, 'enemy1');
			unboundedEnemy.scale.setTo(0.7, 0.7);
			var unboundedEnemyTail = deadEnemys.create(saveX + (315 * 0.7), saveY + 20, 'enemy1');

			unboundedEnemyTail.scale.setTo(0.7, 0.7);
			if (saveDirection) {
				unboundedEnemy.frame = 11;
				unboundedEnemyTail.frame = 12;
			} else {
				unboundedEnemy.frame = 13;
				unboundedEnemyTail.frame = 14;
			}
			player.isInVersusMode = false;

			var count = 0;
			var toCount = Math.floor((Math.random() * 10) + 1);
            
			var soundFile = new Audio('sounds/bonusAll.wav');
			soundFile.play();
			setTimeout(function(){soundFile.pause();}, 3000);
			
			addMovie();
			keyboard.disabled = true;
			var interval = setInterval(function() {
				showBonus();
				if (count >= toCount) {
					$('#bonusText1').remove();
					clearInterval(interval);
					backgroundMap.removeAll();
					$('.movie').remove();
					keyboard.disabled = false;
					player.animations.stop();
					if(player.flipped){
						player.frame = 3;
					} else {
						player.frame = 11;
					}
					backgroundPillows.forEach(function(pill){
					 	pill.frame = 0;
					 });
				} else {
					count++;
				};
			}, 600);
			 backgroundPillows.forEach(function(pill){
			 	pill.animations.play('blink',10, false, false);
			 });

		} else {
			enemy.health--;
			enemyHitSound.play();
			if (enemy.oldX == 0 || enemy.oldX == GAME_WORLD_WIDTH) {
				enemy.body.velocity.x = 0;
				enemyWait = true;
				waitTime = game.time.now;
			}
		}
	};

	var createPlayer = function() {
		var playerTmp = game.add.sprite(32, game.world.height - 300, 'dude');
		playerTmp.scale.setTo(0.6, 0.6);
		game.physics.arcade.enable(playerTmp);

		playerTmp.body.gravity.y = 1000;
		playerTmp.body.collideWorldBounds = true;
		playerTmp.anchor.setTo(0.5, 0.5);
		playerTmp.health = 100;
		playerTmp.animations.add('left', [0, 1, 2], 10, true);
		playerTmp.animations.add('right', [14, 13, 12], 10, true);
		playerTmp.animations.add('fire_and_walk_left', [5, 6, 7], 10, true);
		playerTmp.animations.add('fire_and_walk_right', [10, 9, 8], 10, true);

		playerTmp.animations.add('fire_left', [3, 4, 4, 4, 3], 10, false, true);
		playerTmp.animations.add('fire_right', [11, 10, 10, 10, 11], 10, false, true);
		return playerTmp;
	};

	var createEnemy1 = function(posx, posy, health, strange) {
		var enemy = enemys.create(posx, game.world.height - posy, 'enemy1');
		enemy.scale.setTo(0.7, 0.7);
		game.physics.arcade.enable(enemy);
		enemy.body.immovable = true;
		enemy.body.collideWorldBounds = true;
		enemy.body.bounce.x = 0.1;
		enemy.body.velocity.x = Math.floor((Math.random() * 5) + 1) * 50;
		enemy.oldX = posx;
		enemy.alife = true;
		enemy.flipped = false;
		enemy.type = 1;
		enemy.health = health;
		enemy.animations.add('left', [4, 5, 6], 10, true);
		enemy.animations.add('right', [19, 20, 21], 10, true);
		enemy.animations.add('attack_left', [4,5,6,0,1,2,3], 10, true);
		enemy.animations.add('death_left1', [7, 7, 7, 9, 9, 9, 11, 11, 11], 10, true);
		enemy.animations.add('death_left2', [8,10,12], 10, true);
		enemy.animations.add('death_right1', [13,13,13,15,15,15,17,17,17], 10, true);
		enemy.animations.add('death_right2', [14,16,17], 10, true);
	};

	var createEnemy2 = function(posx, posy, health, strange) {
		var enemy = enemys.create(posx, game.world.height - posy, 'enemy2');
		enemy.scale.setTo(0.7, 0.7);
		game.physics.arcade.enable(enemy);
		enemy.body.immovable = true;
		enemy.body.collideWorldBounds = true;
		enemy.body.bounce.x = 0.1;
		enemy.body.velocity.x = Math.floor((Math.random() * 5) + 1) * 50;
		enemy.oldX = posx;
		enemy.alife = true;
		enemy.flipped = false;
		enemy.type = 2;
		enemy.health = health;
		enemy.animations.add('left', [0, 2, 1], 10, true);
		enemy.animations.add('right', [13, 11, 12], 10, true);
		enemy.animations.add('death_left', [6, 6, 6, 4, 4, 4, 5, 5, 5, 3, 3, 3], 12, false);
		enemy.animations.add('death_right', [7, 7, 7, 9, 9, 9, 8, 8, 8, 10, 10, 10], 12, false);
	};

	var createRandomLevel = function() {
		for (var int = 1; int < GAME_WORLD_WIDTH; int += Math.floor((Math.random() * 5) + 1) * 200) {
			createBackground(int);
		}

		player = createPlayer();

		for (var int = 1600; int < GAME_WORLD_WIDTH - 250; int += Math.floor((Math.random() * 5) + 1) * 1500) {
			createEnemy1(int, 390, 100);
		}

		//for (var int = 1200; int < GAME_WORLD_WIDTH - 250; int += Math.floor((Math.random() * 5) + 1) * 400) {
			//createEnemy2(int, 230, 10);
		//}

		for (var int = 500; int < GAME_WORLD_WIDTH; int += Math.floor((Math.random() * 5) + 1) * 700) {
			createBackgroundHill(int);
		}

		for (var int = 500; int < GAME_WORLD_WIDTH; int += Math.floor((Math.random() * 5) + 1) * 250) {
			createBackgroundPillows(int, Math.floor((Math.random() * game.world.height)), Math.floor((Math.random() * 5) + 1));
		}

		for (var int = 1; int < GAME_WORLD_WIDTH; int += 64) {
			var scaleY = Math.floor((Math.random() * 6) + 1);
			var randomGroundHeight = 32 * scaleY;
			var ground = platforms.create(int, game.world.height - 128, grasArray[Math.floor((Math.random() * 6) + 1)]);
			platforms.create(int, game.world.height - 64, 'gras5');
			ground.body.immovable = true;
			ground.scale.setTo(0.25, 0.25);
		}

		for (var int = 1; int < GAME_WORLD_WIDTH - 800; int += Math.floor((Math.random() * 5) + 1) * 500) {
			createForeground(int);
		}

		var final = finals.create(game.world.width - 500, game.world.height - 620, 'final');
		game.physics.arcade.enable(final);

	};

	var createForeground = function(posx) {
		var tree = foregroundTrees.create(posx, game.world.height - 470, 'steinbaum1');
		tree.scale.setTo(1, 1);
	};

	var createBackgroundHill = function(posx) {
		var hill = backgroundHills.create(posx, game.world.height - 364, 'hill');
	};

	var createBackground = function(posx) {
		var set = Math.floor((Math.random() * 3) + 1);
		var height = 379;
		if (set == 2) {
			height = 307;
		} else if (set == 3) {
			height = 330;
		}
		var tree = backgroundTrees.create(posx, game.world.height - height, treeArray[set]);
		tree.scale.setTo(1, 1);
	};

	var createBackgroundPillows = function(posx, posyManipulator, arrayNr) {
		var pillow = backgroundPillows.create(posx, posyManipulator - 150, cloudArray[arrayNr]);
		pillow.animations.add('blink', [0,1], 2, true);
	};

	var showBonus = function() {
		var pic = Math.floor((Math.random() * 8) + 1)
		var pic = backgroundMap.create(game.camera.x, 0, 'bonusBack'+pic);
		pic.scale.setTo(1,1.1);
		$('#bonusText1').remove();
		var bonusText = $("<div id='bonusText1'></div>");
		var chooseBonusText = Math.floor((Math.random() * 27) + 1);
		var bonusTopPosition = Math.floor((Math.random() * (game.world.height - 400)) + 100);
		bonusText.css({
			'backgroundImage' : 'url(bonus/Bonus_1600x100_' + chooseBonusText + '.jpg)',
			'zIndex' : 2,
			'height' : '110px',
			'width' : '100%',
			'position' : 'absolute',
			'top' : bonusTopPosition,
			'backgroundRepeat' : 'no-repeat',
			'backgroundPosition' : 'center center',
			'backgroundColor' : 'white'
		});
		$('body').append(bonusText);
	};

	var showHud = function() {
		var health = $("<div id='healthContainer'></div>");
		health.css({
			'width' : '220px',
			'height' : '50px',
			'position' : 'absolute',
			'left' : '50px',
			'top' : '20px'
		});

		var score = $("<div id='score'></div>");
		score.css({
			'width' : '220px',
			'height' : '50px',
			'position' : 'absolute',
			'left' : '1100px',
			'top' : '20px',
			'color' : 'white',
			'fontSize' : '35px'
		});

		for (var i = 1; i < 11; i++) {
			var heart = $("<image src='hud/heart.png' id='heart" + i + "'></image>");
			heart.css({
				'width' : '40px',
				'hight' : '40px'
			});
			health.append(heart);
		}

		$('body').append(health);
		$('body').append(score);
	};

	var showGameOverScreen = function() {
		var finishScreen = $('<div id="finishScreen"></div>');
		finishScreen.css({
			'width' : '100%',
			'height' : '100%',
			'left' : '0px',
			'top' : '0px',
			'position' : 'absolute',
			'backgroundImage' : 'url(backgrounds/gameOver1.gif)',
			'backgroundRepeat' : 'no-repeat',
			'backgroundPosition' : 'center center',
			'backgroundColor' : 'black',
			'backgroundSize' : 'contain',
			'opacity' : 0,
			'zIndex' : 10
		});

		$('body').append(finishScreen);
		finishScreen.animate({
			opacity : 1
		}, 2000, function() {
			//			var gameOver2 = new Audio('sounds/gameover2.wav');
			//			gameOver2.play();
		});

		game.paused = true;
		var gameOver1 = new Audio('sounds/gameOver.wav');
		gameOver1.play();
		finishScreen.on('click', function() {
			$('canvas').remove();
			$('#score').text('0');
			$('#score').remove();
			localStorage.gamescore = '';
			new GameJam.Loader2();
			finishScreen.remove();
		});
	};

	var endGame = function() {
		game.paused = true;
		var scoreB = $('<div id="scoreBoard"></div>');
		scoreB.html('<div id="scoreHead">YOU GAINED</div><div id="scoredPoints">' + score + ' Points</div><div id="scoreSubline">Next Stage will be much harder!</div>');
		$('body').append(scoreB);
		var fin = new Audio('sounds/finish.wav');
		fin.play();
		scoreB.on('click', function(){
			$('canvas').remove();
			localStorage.gamescore = score;
			new GameJam.Loader2({newLevel:true});
			scoreB.remove();
		});
		localStorage.gamescore = score;
	};
	
	var addMovie = function(){
		var top = $('<div class="movie"></div>');
		top.css({
			'width':'100%',
			'height':'100px',
			'backgroundColor': 'black',
			'position':'absolute',
			'zIndex': 5,
			'top': '0px',
			'left':'0px'
		});
		
		var bottom = $('<div class="movie"></div>');
		bottom.css({
			'width':'100%',
			'height':'100px',
			'backgroundColor': 'black',
			'position':'absolute',
			'zIndex': 5,
			'bottom': '0px',
			'left':'0px'
		});
		
		$('body').append(top);
		$('body').append(bottom);
	};

	this.render = function() {
		//game.debug.cameraInfo(game.camera, 32, 32);
	};
}; 