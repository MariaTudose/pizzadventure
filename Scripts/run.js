var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});


var width = 800;
var height = 800;

var playerCoords;

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
    sending = game.add.audio('sending');


    //GROUPS FOR ALL GAME OBJECTS:

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
        } else if (map[i] == 'BUTTONS') {
            amount = map[++i];
            for (var x = 1; x <= amount; x++) createButton.apply(this, parseLine(map[i + x]));
        }
        i++;
    }

    //parser for text to array
    function parseLine(line) {
        newline = line.split(',').map(function (str) {
            return parseInt(str) * 20;
        });
        return newline
    }


    //functions for creating different objects on the map
    function createPlat(x, y, width, height) {
        platforms.add(game.add.tileSprite(x, y, width, height, 'block'));
    }

    function createBoost(x, y) {
        boost = game.add.sprite(x, y - 10, 'boost');
        boosters.add(boost);
    }

    function createSpike(x, y, width, height, u) {
        spike = game.add.tileSprite(x, y, width, height, 'spike');
        hitbox = game.add.tileSprite(x + 4, y + 4, width - 8, height - 8, 'spike');
        hitbox.alpha = 0;
        spike.body = null;
        spikes.add(hitbox);
        if (u == 20) spike.frame = 1;
        else if (u == 40) spike.frame = 2;
        else if (u == 60) spike.frame = 3;
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
        portal = game.add.sprite(x - 16, y + 5, 'portal');
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

    function createButton(x, y) {
        buttons.create(x, y, 'button');
    }


    //SPECIAL PLATFORMS:

    //moving platforms
    movPlat1 = game.add.sprite(5 * 20, 31 * 20, 'mblock');
    movPlat2 = game.add.sprite(20, 3 * 20, 'mblock');
    platforms.add(movPlat1);
    platforms.add(movPlat2);

    //platform to be erased by button press
    ePlat = game.add.tileSprite(31 * 20, 27 * 20, 8 * 20, 20, 'block')
    platforms.add(ePlat);

    //invisible wall next to game area
    invisibleWall = game.add.tileSprite(40 * 20, 0, 20, 40 * 20, 'invisibleTile');
    platforms.add(invisibleWall);

    platforms.setAll('body.immovable', true);

    //falling platforms experiment
    //for(var x = 1; x <= 8; x++) {
    //    eTiles[x-1] = game.add.sprite((30+x)*20, 27*20, 'block');
    //    platforms.add(eTiles[x-1])
    //}

    createMenu(game);

    setupAchievements(game);

    var logo = game.add.sprite(0, 0, 'logo');
    s = game.add.tween(logo).to({alpha: 0}, 1000, null, true, 3000);
    s.start();
    s.onComplete.add(function () {
        music.play();
        checkAchievement("NEW GAME");
    }, this);

    cursors = game.input.keyboard.createCursorKeys();
}