var achievements = ["NEW GAME", "LEFTIST", "RIGHTEOUS", "JUMP LIKE A SISSY", "DOWN SYNDROME", "HIGH AS A KITE", "YOUR FIRST BALL!",
    "BALL LOVER", "AVOID SPIKES DUMMY", "JESUS THE SPIKES MAN", "WOW YOU REALLY SUCK", "NOT ENTERTAINED", "INFORMED",
    "PAUSING IS FOR SISSIES", "CLICKING WON'T HELP", "HOW DID U FIND DIS?!?!", "NOT THIS WAY", "WHEW!", "ARE YOU BLIND?",
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
var i = 0;
var aboxes = [];


function setupAchievements(game) {

    //achievement info
    achievements.forEach(function (val) {
        unlocked[val] = false
    });
    var i = 1;
    var j = 1;
    achievements.forEach(function (achi) {
        if (i <= achievements.length / 2) {
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
        if (i < achievements.length / 2) {
            infolist[achievements[i]] = game.add.bitmapText(width + 20, 80 + (i * 45), 'font', info + '\n\n\n', 14);
        } else {
            infolist[achievements[i]] = game.add.bitmapText(width + 205, 80 + (j * 45), 'font', info + '\n\n\n', 14);
            j++;
        }
        infolist[achievements[i]].alpha = 0;
        i++;
    });
}


function checkAchievement(achievement) {
    if (!unlocked[achievement]) achievementUnlocked(achievement);
}

function achievementUnlocked(achievement) {
    achimusic.play();
    unlocked[achievement] = true;
    achilist[achievement].alpha = 1;
    infolist[achievement].alpha = 1;
    box = game.add.sprite(300, height - 15, 'achi');
    text = game.add.bitmapText(310, height - 5, 'font', 'Achievement unlocked !\n' + achievement, 16);
    aboxes.push(box);
    aboxes.push(text);
    for (var b in aboxes) {
        s = aboxes[b];
        game.add.tween(s).to({y: s.y - 50}, 50).start();
    }
    this.game.add.tween(text).to({alpha: 0}, 1000, null, true, 2500).start();
    this.game.add.tween(box).to({alpha: 0}, 1000, null, true, 2500).start();
    i++;
    if (i == achievements.length - 1) achievementUnlocked("GOTTA GET EM ALL");
}