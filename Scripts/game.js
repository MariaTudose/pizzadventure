var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});


var width = 800;
var height = 600;

var player;
var platforms;
var music;
var achimusic;
var jump;
var text;
var box;
var achievements = ["Righteous", "There is no hope", "Don't die", "Leftist", "Malaria",
                    "Too damn high", "Danger Zone", "Hallelujah", "Supernova", "The Terminator", "Intouchable"];
var unlocked = {};
var achilist = {};

function preload() {

    game.load.audio('music', ['audio/music.ogg']);
    game.load.audio('achimusic', ['audio/achi.wav']);
    game.load.audio('jump', ['audio/jump.wav']);
    game.load.image('block', 'images/block.png');
    game.load.image('achi', 'images/achi.png');
    game.load.image('menu', 'images/menu.png');
    game.load.spritesheet('pizza', 'images/pizza.png', 35, 30);
    game.load.bitmapFont('font', 'nokia16.png', 'nokia16.xml');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#cccccc';

    //sounds
    music = game.add.audio('music');
    jump = game.add.audio('jump');
    achimusic = game.add.audio('achimusic');
    music.play();


    platforms = game.add.group();
    platforms.enableBody = true;

    //borders
    for (i = 0; i < 40; i++) {
        platforms.create((i * 20), height - 20, 'block');
        platforms.create((i * 20), 0, 'block');
        platforms.create(0, (i * 20), 'block');
        platforms.create(width - 20, (i * 20), 'block');
    }

    //platforms
    for (i = 0; i < 5; i++) {
        platforms.create(370 + (i * 20), 290, 'block');
        platforms.create(width - 250 + (i * 20), 350, 'block');
        platforms.create(width - 100 + (i * 20), 400, 'block');
        platforms.create(250 + (i * 20), 500, 'block');
    }

    for (i = 0; i < 10; i++) platforms.create((i * 20), 440, 'block');


    platforms.setAll('body.immovable', true);

    //player
    player = game.add.sprite(380, 200, 'pizza');
    game.physics.arcade.enable(player);

    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


    //menu
    menu = game.add.sprite(805, 5, 'menu');
    game.add.bitmapText(820, 15, 'font', 'Achievements', 20);

    //achievement info
    achievements.forEach(function (val) {
        unlocked[val] = false
    });
    var i = 1;
    achievements.forEach(function (achi) {
        achilist[achi] = game.add.bitmapText(820, 20 + (i * 20), 'font', achi + '\n\n\n', 16);
        achilist[achi].alpha = 0.5;
        i += 1;
    });

    //menu buttons and text
    game.add.button(width + 5, height - 25, 'block', mute, this, 2, 1, 0).scale.setTo(3, 1);
    game.add.button(width + 70, height - 25, 'block', pause, this, 2, 1, 0).scale.setTo(3, 1);
    game.add.button(width + 135, height - 25, 'block', info, this, 2, 1, 0).scale.setTo(3, 1);

    game.add.bitmapText(width + 10, height - 24, 'font', 'Mute', 16);
    game.add.bitmapText(width + 75, height - 24, 'font', 'Pause', 16);
    game.add.bitmapText(width + 140, height - 24, 'font', 'Info', 16);


    cursors = game.input.keyboard.createCursorKeys();

}

function update() {


    game.physics.arcade.collide(player, platforms);


    player.body.velocity.x = 0;

    if (cursors.left.isDown) {

        player.body.velocity.x = -350;
        if (player.body.touching.down) player.animations.play('left');
        else player.frame = 1;
        checkAchievement("Leftist");

    }
    else if (cursors.right.isDown) {

        player.body.velocity.x = 350;
        if (player.body.touching.down) player.animations.play('right');
        else player.frame = 7;

        checkAchievement("Righteous");
    }
    else {
        player.animations.stop();
        if (player.body.touching.down)  player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -400;
        jump.play();
        checkAchievement("Too damn high");
    }

}

function mute() {
    if (music.paused) music.resume();
    else music.pause();
}

function pause() {

    menu = game.add.sprite(width / 2, height / 2, 'block');
    menu.scale.setTo(12, 5);
    menu.anchor.setTo(0.5, 0.5);
    game.paused = true;
    text = game.add.bitmapText(width / 2, height / 2, 'font', '                Paused\n\n\nClick anywhere to continue', 16);
    text.anchor.setTo(0.5, 0.5);
    game.input.onDown.add(function () {
        game.paused = false;
        menu.destroy();
        text.destroy();
    }, self);
}

function info() {
    menu = game.add.sprite(width / 2, height / 2, 'block');
    menu.scale.setTo(20, 5);
    menu.anchor.setTo(0.5, 0.5);
    game.paused = true;
    text = game.add.bitmapText(width / 2, height / 2, 'font', 'Collect as many achievements as you can!!!!\n\n\n' +
        'By Maria Tudose & Linda Levänen', 16);
    text.anchor.setTo(0.5, 0.5);
    game.input.onDown.add(function () {
        game.paused = false;
        menu.destroy();
        text.destroy();
    }, self);
}

function checkAchievement(achievement) {
    if (!unlocked[achievement]) achievementUnlocked(achievement);
}

function achievementUnlocked(achievement) {
    achimusic.play();
    unlocked[achievement] = true;
    achilist[achievement].alpha = 1;
    box = game.add.sprite(300, height - 55, 'achi');
    text = game.add.bitmapText(310, height - 45, 'font', 'Achievement unlocked !\n' + achievement, 16);

    s = this.game.add.tween(text).to({alpha: 0}, 4000, null);
    t = this.game.add.tween(box).to({alpha: 0}, 4000, null);
    s.start();
    t.start();
}

