var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});


var width = 800;
var height = 800;

var player;
var platforms;
var music;
var achimusic;
var jump;
var text;
var box;
var achievements = ["NEW GAME", "LEFTIST", "RIGHTEOUS", "JUMP LIKE A SISSY", "DOWN SYNDROME", "HIGH AS A KITE", "YOUR FIRST BALL!",
    "BALL LOVER", "AVOID SPIKES DUMMY", "JESUS THE SPIKES MAN", "WOW YOU REALLY SUCK", "NOT ENTERTAINED", "INFORMED",
    "PAUSING IS FOR SISSIES", "CLICKING WON'T HELP", "HOW DID U FIND DIS?!?!", "NOT THIS WAY", "WHEW!", "ARE YOU BLIND?",
    "ALL THE SALARS", "BRO, IT'S A PRANK!!", "USELESS", "NO WAY OUT", "SUICIDE IS THE ANSWER", "OPEN SESAME", "MISSION IMPOSSIBLE",
    "EXPERT BUTTONEER", "GOTTA GET EM ALL"];
var achiInfos = ["Start a new game", "Move left", "Move right", "Jump", "Press down", "Use trampoline", "Collect a ball",
    "Collect all the balls", "Die", "Die 10 times", "Die 50 times", "Mute the music", "Press info",
    "Pause the game", "Click the game area", "Find the first secret", "Find the second secret", "Find the third secret", "Find the fourth secret",
    "Find all the secrets", "Use the prank teleport", "Use the useless teleport", "Teleport to dead-end", "Commit a suicide", "Press the first button", "Press the second button",
    "Press the third button", "Gain all the achievements"];
var infolist = {};
var unlocked = {};
var achilist = {};
var playerCoords;
var ballCount = 0;
var buttonsPressed = [false,false,false];
var ballsAmount;
var deathCount = 0;


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

    platforms.setAll('body.immovable', true);

    //falling platforms
    //for(var x = 1; x <= 8; x++) {
    //    eTiles[x-1] = game.add.sprite((30+x)*20, 27*20, 'block');
    //    platforms.add(eTiles[x-1])
    //}

    //menu
    menu = game.add.sprite(width + 5, 5, 'menu');
    game.add.bitmapText(width + 120, 25, 'font', 'Achievements', 20);

    //achievement info
    achievements.forEach(function (val) {
        unlocked[val] = false
    });
    var i = 1;
    var j = 1;
    achievements.forEach(function (achi) {
        if(i <= achievements.length / 2) {
            achilist[achi] = game.add.bitmapText(width + 20, 20 + (i * 45), 'font', achi + '\n\n\n', 15);
            i++;
        } else {
            achilist[achi] = game.add.bitmapText(width + 205, 20 + (j * 45), 'font', achi + '\n\n\n', 15);
            j++;
        }
        achilist[achi].alpha = 0.5;
    });

    //infos to achievements
    i = 0;
    j = 0;
    achiInfos.forEach(function (info) {
        if(i < achievements.length / 2) {
            infolist[achievements[i]] = game.add.bitmapText(width + 20, 80 + (i * 45), 'font', info + '\n\n\n', 14);
        } else {
            infolist[achievements[i]] = game.add.bitmapText(width + 205, 80 + (j * 45), 'font', info + '\n\n\n', 14);
            j++;
        }
        infolist[achievements[i]].alpha = 0;
        i++;
    });

    //menu buttons and text
    game.add.button(width + 70, height - 25, 'menubutton', mute, this, 2, 1, 0);
    game.add.button(width + 170, height - 25, 'menubutton', pause, this, 2, 1, 0);
    game.add.button(width + 270, height - 25, 'menubutton', info, this, 2, 1, 0);

    game.add.bitmapText(width + 75, height - 24, 'font', 'Mute', 16);
    game.add.bitmapText(width + 175, height - 24, 'font', 'Pause', 16);
    game.add.bitmapText(width + 275, height - 24, 'font', 'Info', 16);

    cursors = game.input.keyboard.createCursorKeys();

    checkAchievement("NEW GAME");

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
        checkAchievement("BALL LOVER");
    }

    //all the secrets
    if(unlocked["HOW DID U FIND DIS?!?!"] && unlocked["NOT THIS WAY"] && unlocked["WHEW!"] && unlocked["ARE YOU BLIND?"]){
        checkAchievement("ALL THE SALARS");
    }

    //track mouse clicking
    var x = game.input.activePointer.positionDown.x;
    var y = game.input.activePointer.positionDown.y;

    var area = new Phaser.Rectangle(1, 1, 39*20, 39*20);

    if (area.contains(x, y)) {
        checkAchievement("CLICKING WON'T HELP");
    }

    //check secret coordinates
    if(player.body.y > (38*20)) {
        checkAchievement("HOW DID U FIND DIS?!?!");
    }
    if(player.body.x == 0) {
        if(player.body.y < 20*20) {
            checkAchievement("NOT THIS WAY");
        } else {
            checkAchievement("WHEW!");
        }
    }
    if (player.body.x > 38*20) {
        checkAchievement("ARE YOU BLIND?");
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
        checkAchievement("LEFTIST");

    }
    else if (cursors.right.isDown) {

        player.body.velocity.x = 350;
        if (player.body.touching.down) player.animations.play('right');
        else player.frame = 7;

        checkAchievement("RIGHTEOUS");
    }
    else {
        player.animations.stop();
        if (player.body.touching.down)  player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -400;
        jump.play();
        checkAchievement("JUMP LIKE A SISSY");
    }

    if (cursors.down.isDown) {
        checkAchievement("DOWN SYNDROME");
    }

    this.game.input.keyboard.onDownCallback = function(e) {
        if(e.keyCode == 83) {
            checkAchievement("SUICIDE IS THE ANSWER")
            killPlayer(player);
        }
    }
}


function mute() {
    checkAchievement("NOT ENTERTAINED");
    smenubutton.play();
    if (music.paused) music.resume();
    else music.pause();
}



function pause() {
    checkAchievement("PAUSING IS FOR SISSIES");
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
    checkAchievement("INFORMED");
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
    infolist[achievement].alpha = 1;
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
    if(i == achievements.length - 1) achievementUnlocked("GOTTA GET EM ALL");
}

function collectBall(player, ball) {
    checkAchievement("YOUR FIRST BALL!");
    sball.play();
    ballCount++;
    ball.kill();
}

function boostPlayer(player) {
    checkAchievement("HIGH AS A KITE");
    booster.play();
    player.body.velocity.y = -500;
}

function killPlayer(player) {
    checkAchievement("AVOID SPIKES DUMMY");
    deathCount++;
    death.play();
    player.kill();
    player.reset(playerCoords[0], playerCoords[1]);
    if(deathCount == 10) checkAchievement("JESUS THE SPIKES MAN");
    if(deathCount == 50) checkAchievement("WOW YOU REALLY SUCK");
}

function buttonPressed(player, button) {
    if(button.frame == 0)sbutton.play();
    button.frame = 1;
    if (button.body.x == 660) {
        if(!buttonsPressed[0]) {
            achievementUnlocked("MISSION IMPOSSIBLE");
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
            achievementUnlocked("OPEN SESAME");
            disappear.play();
            ePlat.kill();
            blocks = game.add.tileSprite(31*20, 27*20, 8*20, 20, 'block');
            game.add.tween(blocks).to({alpha: 0}, 1000, null, true, 0).start();
            buttonsPressed[1] = true;
        }
    }
    else if (button.body.x == 760) {
        if(!buttonsPressed[2]) {
            achievementUnlocked("EXPERT BUTTONEER");
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
        checkAchievement("USELESS");
        steleport.play();
        player.reset(1*20, 22*20);
    } else if (portal.body.y == 20*20+5) {
        checkAchievement("BRO, IT'S A PRANK!!");
        steleport.play();
        killPlayer(player);
    } else if (portal.body.y == 1*20+5) {
        checkAchievement("NO WAY OUT");
        steleport.play();
        player.reset(2*20, 10*20);

    }
}

