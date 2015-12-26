var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});


var width = 800;
var height = 800;

var player;
var platforms;
var music;
var achimusic;
var jump;
var text;
var box;
var achievements = ["Righteous", "Ball Lover", "There is no hope", "Not Entertained", "Don't die", "Leftist", "U ded", "Malaria",
    "Too damn high", "Danger Zone", "Hallelujah","Informed", "Pausing is for sissies", "Supernova", "Bojoing", "The Terminator", "Intouchable"];
var unlocked = {};
var achilist = {};
var playerCoords;

function preload() {

    game.load.audio('music', ['audio/music.ogg']);
    game.load.audio('achimusic', ['audio/achi.wav']);
    game.load.audio('jump', ['audio/jump.ogg']);
    game.load.audio('booster', ['audio/booster.ogg']);
    game.load.audio('death', ['audio/death.wav']);
    game.load.image('block', 'images/block.png');
    game.load.image('mblock', 'images/mblock.png');
    game.load.image('achi', 'images/achi.png');
    game.load.image('menu', 'images/menu.png');
    game.load.image('ball', 'images/ball.png');
    game.load.image('button', 'images/button.png');
    game.load.image('boost', 'images/boost.png');
    game.load.image('spike', 'images/spikes.png');
    game.load.spritesheet('pizza', 'images/pizza.png', 35, 30);
    game.load.bitmapFont('font', 'nokia16.png', 'nokia16.xml');
    game.load.text('map', 'map.txt');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#cccccc';

    //sounds
    music = game.add.audio('music');
    jump = game.add.audio('jump');
    booster = game.add.audio('booster');
    achimusic = game.add.audio('achimusic');
    death = game.add.audio('death');
    //music.play();


    //platgorms
    platforms = game.add.group();
    platforms.enableBody = true;

    //balls
    balls = game.add.group();
    balls.enableBody = true;

    //boosters
    boosters = game.add.group();
    boosters.enableBody = true;

    //spikes
    spikes = game.add.group();
    spikes.enableBody = true;

    //parse through game objects
    var map = game.cache.getText('map').split('\n');;

    i = 0;
    while (map[i] != "END") {
        if (map[i] == 'PLATFORMS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createPlat.apply(this, parseLine(map[i + x]));
        } else if (map[i] == 'PLAYER') {
            createPlayer.apply(this, parseLine(map[++i]));
        } else if (map[i] == 'BOOSTERS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createBoost.apply(this, parseLine(map[i + x]));
        } else if (map[i] == 'SPIKES') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createSpike.apply(this, parseLine(map[i + x]));
        } else if (map[i] == 'BALLS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createBall.apply(this, parseLine(map[i + x]));
        }
        i++;
    }

    function parseLine(line) {
        newline = line.split(',').map(function (str) {
            return parseInt(str) * 20;
        });
        return newline
    }

    function createPlat(x, y, width, height) {
        platforms.add(game.add.tileSprite(x, y, width, height, 'block'));
    }

    function createBoost(x, y) {
        boosters.create(x, y - 10, 'boost');
    }

    function createSpike(x, y, width, height) {
        spikes.create(x, y, 'spike');
    }

    function createBall(x, y) {
        balls.create(x, y - 30, 'ball');
    }

    function createPlayer(x, y) {
        playerCoords = [x,y]
        player = game.add.sprite(x, y, 'pizza');
        game.physics.arcade.enable(player);

        player.body.gravity.y = 1000;
        player.body.collideWorldBounds = true;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

    }

    platforms.setAll('body.immovable', true);


    //moving platforms
    movPlatforms = game.add.group();
    movPlatforms.enableBody = true;

    movPlat1 = game.add.sprite(5 * 20, 23 * 20, 'mblock');
    movPlat2 = game.add.sprite(10 * 20, 3 * 20, 'mblock');
    platforms.add(movPlat1);
    platforms.add(movPlat2);

    //menu
    menu = game.add.sprite(width + 5, 5, 'menu');
    game.add.bitmapText(width + 20, 15, 'font', 'Achievements', 20);

    //achievement info
    achievements.forEach(function (val) {
        unlocked[val] = false
    });
    var i = 1;
    achievements.forEach(function (achi) {
        achilist[achi] = game.add.bitmapText(width + 20, 20 + (i * 20), 'font', achi + '\n\n\n', 16);
        achilist[achi].alpha = 0.5;
        i += 1;
    });

    //menu buttons and text
    game.add.button(width + 5, height - 25, 'button', mute, this, 2, 1, 0);
    game.add.button(width + 70, height - 25, 'button', pause, this, 2, 1, 0);
    game.add.button(width + 135, height - 25, 'button', info, this, 2, 1, 0);

    game.add.bitmapText(width + 10, height - 24, 'font', 'Mute', 16);
    game.add.bitmapText(width + 75, height - 24, 'font', 'Pause', 16);
    game.add.bitmapText(width + 140, height - 24, 'font', 'Info', 16);


    cursors = game.input.keyboard.createCursorKeys();

}

function update() {


    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(balls, platforms);
    game.physics.arcade.overlap(player, balls, collectBall, null, this);
    game.physics.arcade.overlap(player, boosters, boostPlayer, null, this);
    game.physics.arcade.overlap(player, spikes, killPlayer, null, this);

    //moving platforms
    if(movPlat1.body.y <= (23 * 20)) {
    movPlat1.body.velocity.y = 50;
    } else if (movPlat1.body.y >= (31 * 20)) {
    movPlat1.body.velocity.y = -50;
    }

    if(movPlat2.body.x <= (10 * 20)) {
    movPlat2.body.velocity.x = 50;
    } else if (movPlat2.body.x >= (27 * 20)) {
    movPlat2.body.velocity.x = -50;
    }

    //moving platforms
    if(movPlat1.body.y <= (23 * 20)) {
        movPlat1.body.velocity.y = 50;
    } else if (movPlat1.body.y >= (31 * 20)) {
        movPlat1.body.velocity.y = -50;
    }

    if(movPlat2.body.x <= (10 * 20)) {
        movPlat2.body.velocity.x = 50;
    } else if (movPlat2.body.x >= (27 * 20)) {
        movPlat2.body.velocity.x = -50;
    }

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
    checkAchievement("Not Entertained");
    if (music.paused) music.resume();
    else music.pause();
}

function pause() {
    checkAchievement("Pausing is for sissies");
    menu = game.add.sprite(width / 2, height / 2, 'button');
    menu.scale.setTo(5, 5);
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
    checkAchievement("Informed");
    menu = game.add.sprite(width / 2, height / 2, 'button');
    menu.scale.setTo(8, 5);
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


function collectBall(player, ball) {
    checkAchievement("Ball Lover");
    ball.kill();
}

function boostPlayer(player) {
    checkAchievement("Bojoing");
    booster.play();
    player.body.velocity.y = -600;
}

function killPlayer(player) {
    checkAchievement("U ded");
    death.play();
    player.kill();
    player.reset(playerCoords[0], playerCoords[1]);
}
