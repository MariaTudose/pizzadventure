
function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(balls, platforms);
    game.physics.arcade.overlap(player, balls, collectBall, null, this);
    game.physics.arcade.overlap(player, boosters, boostPlayer, null, this);
    game.physics.arcade.overlap(player, spikes, killPlayer, null, this);
    game.physics.arcade.overlap(player, buttons, buttonPressed, null, this);
    game.physics.arcade.overlap(player, portals, teleport, null, this);

    //check whether the game is finished
    if(gameFinished == true) {
        gameFinished = false;
        if(!music.paused) music.pause();
        var ending = game.add.sprite(0, 0, 'ending');
        sending.play();
        game.add.button(451, 411, 'newgamebutton', create, this, 2, 1, 0);
        //pause();
    }

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