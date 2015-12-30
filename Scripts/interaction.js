var buttonsPressed = [false,false,false];
var ballCount = 0;
var ballsAmount;
var deathCount = 0;

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
