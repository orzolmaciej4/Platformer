class Snow extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.levelKey = key
        this.nextLevel = {
            'Snow1': 'Snow2',
            'Snow2': 'Snow3',
            'Snow3': 'Snow4',
            'Snow4': 'Snow5',
        }
    }

    preload() {
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/platform.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.spritesheet('campfire', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/campfire.png',{ frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png', { frameWidth: 72, frameHeight: 90});
        this.load.image('enemy', 'assets/character.png');
        this.load.image('enemy2', 'assets/character2.png');
    }

    create() {
        gameState.active = true
        gameState.stepLimit = 0;
        gameState.enemySpeed = 1.2;

        gameState.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0xf2f2f2).setOrigin(0, 0);
        gameState.bgColor.setScrollFactor(0);
        this.add.text(10, 50, 'SNOW', {fontSize: '50px', fill: '#000'});

        gameState.player = this.physics.add.sprite(50, 10, 'codey').setScale(.5);
        gameState.player.setCollideWorldBounds(true);
        gameState.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(gameState.player, gameState.platforms);

        this.cameras.main.setBounds(0, 0, 2000, gameState.height);
        this.physics.world.setBounds(0, 0, 2000, gameState.height + gameState.player.height);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)

        gameState.money = this.physics.add.staticGroup();
		this.physics.add.overlap(gameState.player, gameState.money, (player, coin) => {
            coin.destroy();
            gameState.coins++;
            gameState.coinsText.setText(`Coins: ${gameState.coins}`);
        });
        
        gameState.enemies = this.physics.add.group();
        this.physics.add.collider(gameState.enemies, gameState.platforms);
        this.physics.add.overlap(gameState.player, gameState.enemies, () => {
            gameState.lives--;
            gameState.livesText.setText(`Lives: ${gameState.lives}`);
            gameState.coins--;
            gameState.livesText.setText(`Lives: ${gameState.coins}`);
            this.scene.restart();
        })

        gameState.enemies2 = this.physics.add.group();
        this.physics.add.collider(gameState.enemies2, gameState.platforms);
        this.physics.add.overlap(gameState.player, gameState.enemies2, () => {
            gameState.lives--;
            gameState.livesText.setText(`Lives: ${gameState.lives}`);
            gameState.coins--;
            gameState.livesText.setText(`Lives: ${gameState.coins}`);
            this.scene.restart();
        })

        gameState.cursors = this.input.keyboard.createCursorKeys();
        
        this.createAnimations();
        this.levelSetup();

        gameState.levelText = this.add.text(95, 10, `Level: ${this.level}`, {fontSize: '15px', fill: '#000'});
        gameState.levelText.setScrollFactor(0);
        gameState.coinsText = this.add.text(270, 10, `Coins: ${gameState.coins}`, {fontSize: '15px', fill: '#000'});
        gameState.coinsText.setScrollFactor(0);
        gameState.livesText = this.add.text(410, 10, `Lives: ${gameState.lives}`, {fontSize: '15px', fill: '#000'});
        gameState.livesText.setScrollFactor(0);

        // Create the campfire at the end of the level
        gameState.goal = this.physics.add.sprite(1950, 10, 'campfire');
        this.physics.add.collider(gameState.goal, gameState.platforms);
        this.physics.add.overlap(gameState.player, gameState.goal, function() {
            this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
                if (progress > .9) {
                    this.scene.stop(this.levelKey);
                    this.scene.start(this.nextLevel[this.levelKey]);
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
                    gameState.lives--;
                    gameState.livesText.setText(`Lives: ${gameState.lives}`);
                    this.scene.restart(this.levelKey);
                }
            });
        }

        gameState.enemies.getChildren().forEach(enemy => {
            enemy.x -= gameState.enemySpeed;
            gameState.stepLimit++;
            if (gameState.stepLimit > this.limit) {
                gameState.enemySpeed *= -1;
                gameState.stepLimit = 0;
            }
        })

        gameState.enemies2.getChildren().forEach(enemy => {
            enemy.x += gameState.enemySpeed;
            gameState.stepLimit++;
            if (gameState.stepLimit > this.limit) {
                gameState.enemySpeed *= -1;
                gameState.stepLimit = 0;
            }
        })

        if (gameState.coins < 0) {
            gameState.coins = 0;
            gameState.coinsText.setText(`Coins: ${gameState.coins}`);
        }

        if (gameState.lives === 0) {
            this.cameras.main.fade(100, 0, 0, 0, false, function(camera, progress) {
                if (progress > .9) {
                    this.scene.stop(this.levelKey);
                    this.scene.start('GameOver');
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

    createMoney(xIndex, yIndex) {
        if (typeof yIndex === 'number' && typeof xIndex === 'number') {
            gameState.money.create((154 * xIndex) + 77,  (yIndex * 66) - 40, 'coin').setScale(2);
        } 
    }

    createEnemy(xIndex, yIndex) {
        if (typeof yIndex === 'number' && typeof xIndex === 'number') {
            gameState.enemies.create((154 * xIndex) + 150,  (yIndex * 66) - 40, 'enemy').setScale(1.5).setGravityY(-800);
        } 
    }

    createEnemy2(xIndex, yIndex) {
        if (typeof yIndex === 'number' && typeof xIndex === 'number') {
            gameState.enemies2.create((154 * xIndex) + 5,  (yIndex * 66) - 40, 'enemy2').setScale(1.5).setGravityY(-800);
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
        for (const [xIndex, yIndex] of this.platformHeights.entries()) {
            this.createPlatform(xIndex, yIndex);
        }
        for (const [xIndex, yIndex] of this.platformHeights2.entries()) {
            this.createPlatform(xIndex, yIndex);
        }
        for (const [xIndex, yIndex] of this.coinHeights.entries()) {
            this.createMoney(xIndex, yIndex);
        }
        for (const [xIndex, yIndex] of this.enemyHeights.entries()) {
            this.createEnemy(xIndex, yIndex);
        }
        for (const [xIndex, yIndex] of this.enemyHeights2.entries()) {
            this.createEnemy2(xIndex, yIndex);
        } 
    }

}

class Snow1 extends Snow {
    constructor() {
        super('Snow1')
        this.platformHeights = [3, 2, null, 4, 5, 6, null, 6, 5, 4, null, 3.6, 3];
        this.platformHeights2 = [null, null, null, null, null, 3.2, 0.7, 3.2, null, null, null, null, null];
        this.coinHeights = [null, null, null, null, 5, 6, 5, 6, 5, null, null, null, null];
        this.enemyHeights = [null, null, null, null, 5, null, null, 6, null, null, null, null, null];
        this.enemyHeights2 = [null, null, null, null, null, 6, null, null, 5, null, null, null, null];
        this.limit = 460;
        this.level = 'Snow-1';
    }
}

class Snow2 extends Snow {
    constructor() {
        super('Snow2')
        this.platformHeights = [2, 2, null, 6, null, 6, 5, null, 5, 4, null, 5, 6];
        this.platformHeights2 = [null, null, null, null, null, null, 1, 1, 1, 1, 1, 1];
        this.coinHeights = [null, null, 5, 5, null, null, null, null, null, 4, null, null, null];
        this.enemyHeights = [null, null, null, null, null, 6, null, null, null, null, null, 5, null];
        this.enemyHeights2 = [null, 2, null, null, null, null, null, null, 5, null, null, null, null];
        this.limit = 465;
        this.level = 'Snow-2';
    }
}

class Snow3 extends Snow {
    constructor() {
        super('Snow3')
        this.platformHeights = [1, 1, null, 4, 3, 2, 1, 1, 2, 3, 4, null, 4];
        this.platformHeights2 = [null];
        this.coinHeights = [null, null, null, 4, null, null ,null, 1, null, null, 4, null, null];
        this.enemyHeights = [null, null, null, null, 3, null, null, null, 2];
        this.enemyHeights2 = [null, null, null, null, null, 2, null, null, null, 3];
        this.limit = 465;
        this.level = 'Snow-3';
    }
}

class Snow4 extends Snow {
    constructor() {
        super('Snow4')
        this.platformHeights = [4, null, 3.5, 6, null, 6, null, 5.5, 4.5, 3.5, 2.5, 1.5, 1.5];
        this.platformHeights2 = [null, null, null, null, 1, 2, 3, null, 1.7, null, null, null, null];
        this.coinHeights = [null, null, null, null, 1, 2, 3, null, 1.7, null, null, null, null];
        this.enemyHeights = [null, null, 3.5, null, null, 2, 3, 5.5, null, 3.5, null, null, null];
        this.enemyHeights2 = [null];
        this.limit = 600;
        this.level = 'Snow-4';
    }
}