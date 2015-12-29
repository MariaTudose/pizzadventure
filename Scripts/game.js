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
var achievements = ["Righteous", "Ball Lover", "Not Entertained", "Leftist", "U ded",
    "Too damn high", "Informed", "Pausing is for sissies", "Bojoing", "Click", "New game",
    "Secret1", "Secret2", "Secret3", "Secret4", "Secretive", "Zoop", "Boop", "Suicide is the answer", "Collector", "Expert Buttoneer", "Gotta get em all"];
var unlocked = {};
var achilist = {};
var playerCoords;
var buttonCount = 0;
var ballCount = 0;
var button1pressed = false;
var button2pressed = false;
var button3pressed = false;
var ballsAmount;

function preload() {

    game.load.audio('music', ['audio/music.ogg']);
    game.load.audio('achimusic', ['audio/achi.wav']);
    game.load.audio('jump', ['audio/jump.ogg']);
    game.load.audio('booster', ['audio/booster.ogg']);
    game.load.audio('death', ['audio/death.wav']);
    game.load.audio('ball', ['audio/ball.ogg']);
    game.load.audio('menubutton', ['audio/menubutton.ogg']);
    game.load.audio('button', ['audio/button.ogg']);
    game.load.audio('teleport', ['audio/teleport.ogg']);
    game.load.image('block', 'images/block.png');
    game.load.image('mblock', 'images/mblock.png');
    game.load.image('achi', 'images/achi.png');
    game.load.image('menu', 'images/menu.png');
    game.load.image('ball', 'images/ball.png');
    game.load.image('menubutton', 'images/menubutton.png');
    game.load.image('boost', 'images/boost.png');
    game.load.image('invisibleTile', 'images/invisibleTile.png')
    game.load.spritesheet('spike', 'images/spikes.png', 20, 20);
    game.load.spritesheet('pizza', 'images/pizza.png', 35, 30);
    game.load.spritesheet('button', 'images/button.png', 20, 20);
    game.load.spritesheet('portal', 'images/portalsheet2.png', 32, 32, 4);
    game.load.bitmapFont('font', 'nokia16.png', 'nokia16.xml');
    game.load.text('map', 'lvl_structure/map.txt');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#E8D5B7';

    //sounds
    music = game.add.audio('music');
    jump = game.add.audio('jump');
    booster = game.add.audio('booster');
    achimusic = game.add.audio('achimusic');
    death = game.add.audio('death');
    sbutton = game.add.audio('button');
    smenubutton = game.add.audio('menubutton');
    sball = game.add.audio('ball');
    steleport = game.add.audio('teleport');
    music.play();

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

    //buttons
    buttons = game.add.group();
    buttons.enableBody = true;

    //portals
    portals = game.add.group();
    portals.enableBody = true;

    //parse through game objects
    var map = game.cache.getText('map').split('\n');

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
            ballsAmount = amount;
            for (var x = 1; x <= amount; x++) createBall.apply(this, parseLine(map[i + x]));
        } else if (map[i] == 'PORTALS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createPortal.apply(this, parseLine(map[i + x]));
        } else if (map[i] == 'SECRETS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createSecret.apply(this, parseLine(map[i + x]));
        } else if (map[i] == 'BUTTONS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createButton.apply(this, parseLine(map[i + x]));
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
        boost = game.add.sprite(x, y-10, 'boost');
        boosters.add(boost);
        boost.hitArea
    }

    function createSpike(x, y, width, height, u) {
        spike = game.add.tileSprite(x, y, width, height, 'spike');
        hitbox = game.add.tileSprite(x+4, y+4, width-8, height-8, 'spike');
        hitbox.alpha = 0;
        spike.body = null;
        spikes.add(hitbox);
        if(u == 20) spike.frame = 1;
        else if(u == 40) spike.frame = 2;
        else if(u == 60) spike.frame = 3;
    }

    function createBall(x, y) {
        balls.create(x, y, 'ball');
    }

    function createPlayer(x, y) {
        playerCoords = [x, y];
        player = game.add.sprite(x, y, 'pizza');
        game.physics.arcade.enable(player);

        player.body.gravity.y = 1000;
        player.body.collideWorldBounds = true;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
    }

    function createPortal(x, y) {
        portal = game.add.sprite(x-16, y+5, 'portal');
        portals.add(portal);
        var around = portal.animations.add('around');
        portal.animations.play('around', 5, true);
    }

    function createSecret(x, y, type) {
        if (type == 20) {
             game.add.sprite(x, y, 'spike');
        } else {
            game.add.sprite(x, y, 'block');
        }
    }

    function createButton(x,y) {
        buttons.create(x, y, 'button');
    }

    movPlat1 = game.add.sprite(5 * 20, 31 * 20, 'mblock');
    movPlat2 = game.add.sprite(20, 3 * 20, 'mblock');
    platforms.add(movPlat1);
    platforms.add(movPlat2);

    //platform to be erased by button press
    ePlat = game.add.tileSprite(31*20, 27*20, 8*20, 20, 'block')
    platforms.add(ePlat);

    //invisible wall next to game area
    invisibleWall = game.add.tileSprite(40*20, 0, 20, 40*20, 'invisibleTile');
    platforms.add(invisibleWall);

    platforms.setAll('body.immovable', true);

    //falling platforms
    //for(var x = 1; x <= 8; x++) {
    //    eTiles[x-1] = game.add.sprite((30+x)*20, 27*20, 'block');
    //    platforms.add(eTiles[x-1])
    //}

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
    game.add.button(width + 5, height - 25, 'menubutton', mute, this, 2, 1, 0);
    game.add.button(width + 70, height - 25, 'menubutton', pause, this, 2, 1, 0);
    game.add.button(width + 135, height - 25, 'menubutton', info, this, 2, 1, 0);

    game.add.bitmapText(width + 10, height - 24, 'font', 'Mute', 16);
    game.add.bitmapText(width + 75, height - 24, 'font', 'Pause', 16);
    game.add.bitmapText(width + 140, height - 24, 'font', 'Info', 16);

    cursors = game.input.keyboard.createCursorKeys();

    checkAchievement("New game");

}

function update() {


    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(balls, platforms);
    game.physics.arcade.overlap(player, balls, collectBall, null, this);
    game.physics.arcade.overlap(player, boosters, boostPlayer, null, this);
    game.physics.arcade.overlap(player, spikes, killPlayer, null, this);
    game.physics.arcade.overlap(player, buttons, buttonPressed, null, this);
    game.physics.arcade.overlap(player, portals, teleport, null, this);

    //check whether the player has all achis
    if(unlocked.length == achievements.length - 1) {
        checkAchievement("Gotta get em all");
    }

    //check if has pressed every button
    if(buttonCount == 3){
        checkAchievement("Expert Buttoneer");
    }

    //collected all the balls
    if(ballCount == ballsAmount) {
        checkAchievement("Collector");
    }

    //all the secrets
    if(unlocked["Secret1"] && unlocked["Secret2"] && unlocked["Secret3"] && unlocked["Secret4"]){
        checkAchievement("Secretive");
    }

    //track mouse clicking
    var x = game.input.activePointer.positionDown.x
    var y = game.input.activePointer.positionDown.y

    var area = new Phaser.Rectangle(1, 1, 39*20, 39*20);

    if (area.contains(x, y)) {
        checkAchievement("Click");
    }

    //check secret coordinates
    if(player.body.y > (38*20)) {
        checkAchievement("Secret1");
    }
    if(player.body.x == 0) {
        if(player.body.y < 20*20) {
            checkAchievement("Secret2");
        } else {
            checkAchievement("Secret3");
        }
    }
    if (player.body.x > 38*20) {
        checkAchievement("Secret4");
    }

    //moving platforms
    if (movPlat1.body.y <= (20 * 20)) {
        movPlat1.body.velocity.y = 100;
    } else if (movPlat1.body.y >= (31 * 20)) {
        movPlat1.body.velocity.y = -100;
    }

    if (movPlat2.body.x <= (20)) {
        movPlat2.body.velocity.x = 120;
    } else if (movPlat2.body.x >= (28 * 20)) {
        movPlat2.body.velocity.x = -120;
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

    this.game.input.keyboard.onDownCallback = function(e) {
        if(e.keyCode == 83) {
            checkAchievement("Suicide is the answer")
            killPlayer(player);
        }
    }
}


function mute() {
    checkAchievement("Not Entertained");
    smenubutton.play();
    if (music.paused) music.resume();
    else music.pause();
}



function pause() {
    checkAchievement("Pausing is for sissies");
    smenubutton.play();
    menu = game.add.sprite(width / 2, height / 2, 'menubutton');
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
    smenubutton.play();
    menu = game.add.sprite(width / 2, height / 2, 'menubutton');
    menu.scale.setTo(8, 12);
    menu.anchor.setTo(0.5, 0.5);
    game.paused = true;
    text = game.add.bitmapText(width / 2, height / 2, 'font',
        'Controls:\n\n' +
        'Right - Right arrow key\n' +
        'Left - Left arrow key\n' +
        'Jump - Up arrow key\n' +
        'Suicide - S\n\n' +
        'Collect as many achievements as you can!!!!\n\n' +
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

var i = 0;
aboxes = [];

function achievementUnlocked(achievement) {
    achimusic.play();
    unlocked[achievement] = true;
    achilist[achievement].alpha = 1;
    box = game.add.sprite(300, height - 15, 'achi');
    text = game.add.bitmapText(310, height - 5, 'font', 'Achievement unlocked !\n' + achievement, 16);
    aboxes.push(box);
    aboxes.push(text);
    for(var b in aboxes) {
        s = aboxes[b];
        game.add.tween(s).to({y: s.y - 50},50).start();
    };
    this.game.add.tween(text).to({alpha: 0}, 1000, null, true, 2500).start();
    this.game.add.tween(box).to({alpha: 0}, 1000, null, true, 2500).start();
    i++;
    if(i == achievements.length) achievementUnlocked("Gotta get em all");
}

function collectBall(player, ball) {
    checkAchievement("Ball Lover");
    sball.play();
    ballCount++;
    ball.kill();
}

function boostPlayer(player) {
    checkAchievement("Bojoing");
    booster.play();
    player.body.velocity.y = -500;
}

function killPlayer(player) {
    checkAchievement("U ded");
    death.play();
    player.kill();
    player.reset(playerCoords[0], playerCoords[1]);
}

function buttonPressed(player, button) {
    checkAchievement("Boop");
    if(button.frame == 0)sbutton.play();
    button.frame = 1;
    if (button.body.x == 660) {
        platforms.add(game.add.tileSprite(36*20, 9*20, 3*20, 20, 'block'));
        if(button1pressed == false) {
            buttonCount++;
            button1pressed = true;
        }
    }
    else if (button.body.x == 140) {
        ePlat.kill()
        if(button2pressed == false) {
            buttonCount++;
            button2pressed = true;
        }
    }
    else if (button.body.x == 760) {
        platforms.add(game.add.tileSprite(7*20, 6*20, 20, 20, 'block'));
        if(button3pressed == false) {
            buttonCount++;
            button3pressed = true;
        }

    }

    platforms.setAll('body.immovable', true);
}

function teleport(player, portal) {
    checkAchievement("Zoop");
    if (portal.body.y == 37*20+5) {
        steleport.play();
        player.reset(2*20, 10*20);
    } else if (portal.body.y == 20*20+5) {
        steleport.play();
        killPlayer(player);
    } else if (portal.body.y == 1*20+5) {
        steleport.play();
        player.reset(1*20, 22*20)
    }
}

