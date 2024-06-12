const gameState = {
    speed: 200,
    jump: 350,
    width: 1000, 
    height: 420,
    lives: 10,
    coins: 0,
    enemySpeed: 1,
    stepLimit: 0,
};

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 420,
    fps: {target: 60},
    backgroundColor: "b9eaff",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            enableBody: true,
            debug: false,
        }
    },
    scene: [Test1, Test2, Test3, Test4, StartScene, Forest1, Forest2, Forest3, Forest4, Forest5, Caves1, Caves2, Caves3, Caves4, Caves5, Mountains1, Mountains2, Mountains3, Mountains4, Mountains5, Snow1, Snow2, Snow3, Snow4, Snow5, GameOver]
};
  
const game = new Phaser.Game(config);