var game_width = 1000;
var game_height = 600;
var slickUI;

var game = new Phaser.Game(game_width, game_height, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    //FONTS
    game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.image('tiles-2', 'assets/tiles-2.png')
    game.load.image('sheet', 'assets/sheet.png')
    game.load.image('ggg', 'assets/ggg.png')

    game.load.spritesheet('player', 'assets/player.png', 16, 32);

    game.load.image('background', 'assets/Background.png');

    game.load.audio('forest-background', ['assets/audio/forest.mp3', 'assets/audio/forest.ogg']);
    game.load.image('bullet', 'assets/bullet01.png');

    slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
    slickUI.load('assets/ui/kenney/kenney.json');
}

var sprite;
var bullet;
var bullets;
var bulletTime = 0;

var map;
var tileset;
var layer1, layer2;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var size = new Phaser.Rectangle();
var zooming = false;
var zoomAmount = 0;

var music;
var musicStarted = false;
var musicVolume = 1;
var inCaveN = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;

    game.stage.backgroundColor = '#000000';
    game.input.touch.preventDefault = false;
    bg = game.add.tileSprite(0, 0, game_width, game_height, 'background');
    bg.fixedToCamera = true;

    music = game.add.audio('forest-background');
    music.onDecoded.add(start, this);

    map = game.add.tilemap('level1');

    // map.addTilesetImage('tiles-1');
    map.addTilesetImage('tiles-2');
    map.addTilesetImage('sheet');
    map.addTilesetImage('ggg');

    //map.setCollisionByExclusion([197, 198, 199, 200, 201, 229, 230, 231, 232, 233, 1025, 1206, 1042, 1043, 1073, 1074, 1075, 1124, 1125, 1126, 1141, 1142, 1143], true, 'background', true);
    map.setCollisionByExclusion([1056, 197, 198, 199, 200, 201, 202, 229, 230, 231, 232, 233, 234, 1124, 1125, 1126, 1141, 1142, 1143, 1073, 1074, 1075, 1090, 1091, 1092, 1122], true, 'platform', true);

    //layer2 = map.createLayer('background');

    layer1 = map.createLayer('platform');

    layer1.resizeWorld();
    //layer2.resizeWorld();

    map.setTileIndexCallback(1056, gameOver, this);
    map.setTileIndexCallback(1155, inCave, this); // вход в пещеру
    map.setTileIndexCallback(1156, ofCave, this);  //выход из пещеры

    player = game.add.sprite(32, 32, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 0, 0);
    player.body.gravity.y = 300;
    player.body.maxVelocity.y = 1000;

    bullets = game.add.group();

    bullets.enableBody = true;

    // bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(10, 'bullet');
    bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);
    bullets.setAll('checkWorldBounds', true);

    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    player.animations.add('turn', [8], 20, true);
    player.animations.add('right', [9, 10, 11, 12, 13, 14, 16, 17], 15, true);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //Render UI
    UI();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
    game.physics.arcade.collide(player, layer1);
    game.physics.arcade.collide(bullet, layer1);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        bg.tilePosition.x += 0.4;

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        bg.tilePosition.x -= 0.4;
        //fireBullet()
        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    } else {
        if (facing != 'idle') {
            player.animations.stop();

            if (facing == 'left') {
                player.frame = 0;
            } else {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {

        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function render() {
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

function gameOver(sprite, tile) {
    console.log(1)
    //player.body.x = 37;
    //player.body.y = 870;
    //game.add.text(player.body.x, player.body.y, 'Game Over', { font: "65px Arial", fill: "#ff0044", align: "center" });

    return false;
}

function start() {
    music.play();
}

function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(player.x + 5, player.y + 10);
            bullet.body.velocity.x = 1000;
            bulletTime = game.time.now + 250;
        }
    }

}

function resetBullet(bullet) {

    bullet.kill()

}

function inCave() { //вход в пещеру
    if (musicVolume == 1) {
        musicVolume = 0.1;
        music.volume = musicVolume;
    }

    if (inCaveN == 0) {
        setTimeout(() => {
            game.camera.shake(0.005, 200);
        }, 700)
    }
}

function ofCave() { //выход из пещеры
    if (musicVolume == 0.1) {
        musicVolume = 1;
        music.volume = musicVolume;
    }
}