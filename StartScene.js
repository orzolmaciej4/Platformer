class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
        this.heights = [5, 5, 5, 5, 5, 5, 4, 3, 3, null, 6, 5, 5];
    }

    preload() {
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/platform.png');
        this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png', { frameWidth: 72, frameHeight: 90});
        this.load.spritesheet('campfire', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/campfire.png', { frameWidth: 32, frameHeight: 32});
    }

    create() {
        gameState.active = true;
        gameState.lives = 10;
        gameState.coins = 0;
        
        this.add.text(10, 20, "Welcome to 'The Platformer'", {fontSize: '36px', fill: '#000'});
        this.add.text(340, 250, 'Use the arrow keys to\n move left and right', {fontSize: '20px', fill: '#000'});
        this.add.text(740, 200, 'Use the spacebar to jump', {fontSize: '20px', fill: '#000'});
        this.add.text(1050, 100, "Don't fall or you will lose a life\nand respawn at the start of the level", {fontSize: '20px', fill: '#000'});
        this.add.text(1560, 200, 'Go through the portal to advance\n       to the next level\n   Good luck on your adventure', {fontSize: '20px', fill: '#000'});
        
        gameState.player = this.physics.add.sprite(50, 10, 'codey').setScale(.5);
        gameState.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, 2000, gameState.height);
        this.physics.world.setBounds(0, 0, 2000, gameState.height + gameState.player.height);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);

        gameState.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(gameState.player, gameState.platforms);
        
        gameState.cursors = this.input.keyboard.createCursorKeys();
        
        this.createAnimations();
        this.levelSetup();
        
        gameState.goal = this.physics.add.sprite(1950, 100, 'campfire');
        this.physics.add.collider(gameState.goal, gameState.platforms);
        this.physics.add.overlap(gameState.player, gameState.goal, function() {
            this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
                if (progress > .9) {
                    this.scene.stop('StartScene');
                    this.scene.start('Forest1');
                }
            });
        }, null, this); 
    }

    update() {
        if(gameState.active){
            gameState.goal.anims.play('fire', true);
            if (gameState.cursors.right.isDown) {
                gameState.player.flipX = false;
                gameState.player.setVelocityX(gameState.speed);
                gameState.player.anims.play('run', true);
            } else if (gameState.cursors.left.isDown) {
                gameState.player.flipX = true;
                gameState.player.setVelocityX(-gameState.speed);
                gameState.player.anims.play('run', true);
            } else {
                gameState.player.setVelocityX(0);
                gameState.player.anims.play('idle', true);
            }
      
            if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
                gameState.player.anims.play('jump', true);
                gameState.player.setVelocityY(-gameState.jump);
            }
      
            if (!gameState.player.body.touching.down){
                gameState.player.anims.play('jump', true);
            }
        }

        if (gameState.player.y > gameState.height) {
            this.cameras.main.shake(240, .01, false, function(camera, progress) {
                if (progress > .9) {
                    this.scene.restart();
                }
            });
        }
    }

    createPlatform(xIndex, yIndex) {
        // Creates a platform evenly spaced along the two indices.
        // If either is not a number it won't make a platform
        if (typeof yIndex === 'number' && typeof xIndex === 'number') {
            gameState.platforms.create((154 * xIndex),  yIndex * 66, 'platform').setOrigin(0, 0.5).setScale(0.7, 1).refreshBody();
        }
    }

    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('codey', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('campfire'),
            frameRate: 10,
            repeat: -1
        })
    }

    levelSetup() {
        for (const [xIndex, yIndex] of this.heights.entries()) {
            this.createPlatform(xIndex, yIndex);
        }
    }
    
}


