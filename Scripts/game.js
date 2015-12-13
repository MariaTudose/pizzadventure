var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player;
var platforms;
var music;
var achimusic;
var jump;
var text;
var box;
var achievements = {"Go right": false, "Go left": false, "Jump": false, "Press Down": false};

function preload() {

    game.load.audio('music', ['audio/music.ogg']);
    game.load.audio('achimusic', ['audio/achi.wav']);
    game.load.audio('jump', ['audio/jump.wav']);
    game.load.image('land', 'images/land.png');
    game.load.image('wall', 'images/wall.png');
    game.load.image('block', 'images/block.png');
    game.load.image('achi', 'images/achi.png');
    game.load.spritesheet('pizza', 'images/pizza.png', 35, 30);
    game.load.bitmapFont('font', 'nokia16.png', 'nokia16.xml');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //sounds
    music = game.add.audio('music');
    jump = game.add.audio('jump');
    achimusic = game.add.audio('achimusic');
    music.play();


    platforms = game.add.group();
    platforms.enableBody = true;

    //borders
    platforms.create(0, game.world.height - 20, 'land');
    platforms.create(0, 0, 'land');
    platforms.create(0, 0, 'wall');
    platforms.create(game.world.width - 20, 0, 'wall');

    //platforms
    platforms.create(370, 290, 'block').scale.setTo(5, 1);
    platforms.create(game.world.width - 250, 350, 'block').scale.setTo(5, 1);
    platforms.create(0, 450, 'block').scale.setTo(10, 1);
    platforms.create(game.world.width - 100, 400, 'block').scale.setTo(5, 1);
    platforms.create(250, 500, 'block').scale.setTo(5, 1);

    platforms.setAll('body.immovable', true);

    player = game.add.sprite(380, 200, 'pizza');
    game.physics.arcade.enable(player);

    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {


    game.physics.arcade.collide(player, platforms);


    player.body.velocity.x = 0;

    if (cursors.left.isDown) {

        player.body.velocity.x = -350;
        if (player.body.touching.down) player.animations.play('left');
        else player.frame = 1;

        if (!achievements["Go Left"]) achievementUnlocked("Go Left", "neega");
    }
    else if (cursors.right.isDown) {

        player.body.velocity.x = 350;
        if (player.body.touching.down) player.animations.play('right');
        else player.frame = 7;

        if (!achievements["Go Right"]) achievementUnlocked("Go Right", "Wow you just went right");
    }
    else if (cursors.down.isDown) {
        if (!achievements["Press Down"]) achievementUnlocked("Press Down", "Dont press down");
    }
    else {
        player.animations.stop();
        if (player.body.touching.down)  player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -420;
        jump.play();
        if (!achievements["Jump"]) achievementUnlocked("Jump", "You jump like a faggot");
    }

}

function achievementUnlocked(achievement, text) {
    achimusic.play();
    achievements[achievement] = true;
    box = game.add.sprite(300, game.world.height - 55, 'achi');
    text = game.add.bitmapText(310, game.world.height - 45, 'font', 'Achievement unlocked !\n' + text, 16);

    s = this.game.add.tween(text).to({alpha: 0}, 4000, null);
    t = this.game.add.tween(box).to({alpha: 0}, 4000, null);
    s.start();
    t.start();
}