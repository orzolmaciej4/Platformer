const itemsData = [
    {
        name: 'Extra Life',
        price: 5,
        x: 540,
        y: 290,
    },
    {
        name: 'Speed',
        price: 10,
        x: 845,
        y: 290,
    },
    {
        name: 'Double Jump',
        price: 20,
        x: 1155,
        y: 285,
    },
    {
        name: 'Rich',
        price: 15,
        x: 1465,
        y: 290,
    },
]

class Shop extends Phaser.Scene {
    constructor() {
        super('Shop');
        this.heights = [2, 3, 4, 5, 4, 5, 4, 5, 4, 5, 4, 3, 2];
        this.level = 'Shop';
    }

    preload() {
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/platform.png');
        this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png', { frameWidth: 72, frameHeight: 90});
        this.load.spritesheet('campfire', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/campfire.png', { frameWidth: 32, frameHeight: 32});
        this.load.image('Extra Life', 'assets/potion.png');
        this.load.image('Speed', 'assets/sArrow.png');
        this.load.image('Rich', 'assets/coin.png');
        this.load.image('Double Jump', 'assets/character.png');
    }

    create() {
        gameState.active = true;

        gameState.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x754302).setOrigin(0, 0);
        gameState.bgColor.setScrollFactor(0);
        
        gameState.player = this.physics.add.sprite(50, 50, 'codey').setScale(.5);
        gameState.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, 2000, gameState.height);
        this.physics.world.setBounds(0, 0, 2000, gameState.height + gameState.player.height);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);

        gameState.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(gameState.player, gameState.platforms);
        
        gameState.cursors = this.input.keyboard.createCursorKeys();
        
        this.createAnimations();
        this.levelSetup();

        gameState.levelText = this.add.text(130, 10, `Level: ${this.level}`, {fontSize: '15px', fill: '#000'});
        gameState.levelText.setScrollFactor(0);
        gameState.coinsText = this.add.text(270, 10, `Coins: ${gameState.coins}`, {fontSize: '15px', fill: '#000'});
        gameState.coinsText.setScrollFactor(0);
        gameState.livesText = this.add.text(385, 10, `Lives: ${gameState.lives}`, {fontSize: '15px', fill: '#000'});
        gameState.livesText.setScrollFactor(0);

        gameState.goal = this.physics.add.sprite(1950, 50, 'campfire');
        this.physics.add.collider(gameState.goal, gameState.platforms);
        this.physics.add.overlap(gameState.player, gameState.goal, function() {
            this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
                if (progress > .9) {
                    this.scene.stop('Shop');
                    this.scene.start('StartScene');
                }
            });
        }, null, this);

        gameState.items = this.physics.add.staticGroup();
        itemsData.forEach(item => {
            const {x, y, name, price, stock} = item
            gameState.items.create(x, y, name).setScale(2)
            this.add.text(x - 75, y + 80, `Item: ${name} \nPrice: ${price}`, {fontSize: '15px', fill: '#000'});
        });
        this.physics.add.collider(gameState.player, gameState.items)
        /*
        gameState.potion = this.physics.add.staticGroup();
        gameState.potion.create(540, 290, 'Extra Life').setScale(2);
        this.physics.add.collider(gameState.player, gameState.potion, () => {
            gameState.one = this.add.text(465, 200, 'Would you like to\npurchase a potion?', {fontSize: '15px'})
            this.add.text(465, 235, 'Yes')
            this.add.text(465, 250, 'No')
            
        })
        */
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