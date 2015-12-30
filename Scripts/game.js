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
<<<<<<< HEAD
var achievements = {"Go right": false, "Go left": false, "Jump": false, "Press Down": false};

function preload() {
=======
var achievements = ["New Game", "Leftist", "Righteous", "Jump Like a Sissy", "Down Syndrome", "High as a Kite", "Your First Ball!",
    "Ball Lover", "avoid spikes dummy", "JEsus the spikes man", "wow you really suck", "Not Entertained", "Informed",
    "Pausing is for sissies", "Clicking won't help", "Bro, It's a Prank!!", "how did u find dis?!?!", "Not this way", "Whew!", 
    "Are You Blind?", "all the salars", "Useless", "No Way Out", "Suicide is the answer", "Open Sesame", "Mission Impossible",
    "Expert Buttoneer", "Gotta get em all"];
var unlocked = {};
var achilist = {};
var playerCoords;
var ballCount = 0;
var buttonsPressed = [false,false,false];
var ballsAmount;
var deathCount = 0;
>>>>>>> d0424e8793035d8aeab4201fa41f93693e808b79


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
    appear = game.add.audio('appear');
    disappear = game.add.audio('disappear');

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

<<<<<<< HEAD
    //platforms
    platforms.create(370, 370, 'block').scale.setTo(5, 1);
    platforms.create(game.world.width - 250, 300, 'block').scale.setTo(5, 1);
    platforms.create(0, 450, 'block').scale.setTo(10, 1);
    platforms.create(game.world.width - 100, 400, 'block').scale.setTo(5, 1);
    platforms.create(250, 500, 'block').scale.setTo(5, 1);
    platforms.create(300, 230, 'block').scale.setTo(7, 1);
    platforms.create(0, 150, 'block').scale.setTo(9, 1);
=======
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
>>>>>>> d0424e8793035d8aeab4201fa41f93693e808b79

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

    checkAchievement("New Game");

}

function update() {


    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(balls, platforms);
    game.physics.arcade.overlap(player, balls, collectBall, null, this);
    game.physics.arcade.overlap(player, boosters, boostPlayer, null, this);
    game.physics.arcade.overlap(player, spikes, killPlayer, null, this);
    game.physics.arcade.overlap(player, buttons, buttonPressed, null, this);
    game.physics.arcade.overlap(player, portals, teleport, null, this);

    //collected all the balls
    if(ballCount == ballsAmount) {
        checkAchievement("Ball Lover");
    }

    //all the secrets
    if(unlocked["how did u find dis?!?!"] && unlocked["Not this way"] && unlocked["Whew!"] && unlocked["Are You Blind?"]){
        checkAchievement("all the salars");
    }

    //track mouse clicking
    var x = game.input.activePointer.positionDown.x;
    var y = game.input.activePointer.positionDown.y;

    var area = new Phaser.Rectangle(1, 1, 39*20, 39*20);

    if (area.contains(x, y)) {
        checkAchievement("Clicking won't help");
    }

    //check secret coordinates
    if(player.body.y > (38*20)) {
        checkAchievement("how did u find dis?!?!");
    }
    if(player.body.x == 0) {
        if(player.body.y < 20*20) {
            checkAchievement("Not this way");
        } else {
            checkAchievement("Whew!");
        }
    }
    if (player.body.x > 38*20) {
        checkAchievement("Are You Blind?");
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
        checkAchievement("Jump Like a Sissy");
    }

    if (cursors.down.isDown) {
        checkAchievement("Down Syndrome");
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
    if(i == achievements.length - 1) achievementUnlocked("Gotta get em all");
}

function collectBall(player, ball) {
    checkAchievement("Your First Ball!");
    sball.play();
    ballCount++;
    ball.kill();
}

function boostPlayer(player) {
    checkAchievement("High as a Kite");
    booster.play();
    player.body.velocity.y = -500;
}

function killPlayer(player) {
    checkAchievement("avoid spikes dummy");
    deathCount++;
    death.play();
    player.kill();
    player.reset(playerCoords[0], playerCoords[1]);
    if(deathCount == 10) checkAchievement("JEsus the spikes man");
    if(deathCount == 50) checkAchievement("wow you really suck");
}

function buttonPressed(player, button) {
    if(button.frame == 0)sbutton.play();
    button.frame = 1;
    if (button.body.x == 660) {
        if(!buttonsPressed[0]) {
            achievementUnlocked("Mission Impossible");
            appear.play();
            blocks = game.add.tileSprite(36*20, 9*20, 3*20, 20, 'block');
            platforms.add(blocks);
            blocks.alpha = 0;
            tween = game.add.tween(blocks).to({alpha: 1}, 1000, null, true, 0).start();
            buttonsPressed[0] = true;
        }
    }
    else if (button.body.x == 140) {
        if(!buttonsPressed[1]) {
            achievementUnlocked("Open Sesame");
            disappear.play();
            ePlat.kill();
            blocks = game.add.tileSprite(31*20, 27*20, 8*20, 20, 'block');
            game.add.tween(blocks).to({alpha: 0}, 1000, null, true, 0).start();
            buttonsPressed[1] = true;
        }
    }
    else if (button.body.x == 760) {
        if(!buttonsPressed[2]) {
            achievementUnlocked("Expert Buttoneer");
            appear.play();
            blocks = game.add.tileSprite(7*20, 6*20, 20, 20, 'block');
            platforms.add(blocks);
            blocks.alpha = 0;
            tween = game.add.tween(blocks).to({alpha: 1}, 1000, null, true, 0).start();
            buttonsPressed[2] = true;
        }

    }

    platforms.setAll('body.immovable', true);
}

function teleport(player, portal) {
    if (portal.body.y == 37*20+5) {
        checkAchievement("Useless");
        steleport.play();
        player.reset(1*20, 22*20);
    } else if (portal.body.y == 20*20+5) {
        checkAchievement("Bro, It's a Prank!!");
        steleport.play();
        killPlayer(player);
    } else if (portal.body.y == 1*20+5) {
        checkAchievement("No Way Out");
        steleport.play();
        player.reset(2*20, 10*20);

    }
}

