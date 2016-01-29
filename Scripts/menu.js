function createMenu(game) {
    menu = game.add.sprite(width + 5, 5, 'menu');
    game.add.bitmapText(width + 120, 25, 'font', 'Achievements', 20);

    game.add.button(width + 70, height - 25, 'menubutton', mute, this, 2, 1, 0);
    game.add.button(width + 170, height - 25, 'menubutton', pause, this, 2, 1, 0);
    game.add.button(width + 270, height - 25, 'menubutton', info, this, 2, 1, 0);

    game.add.bitmapText(width + 75, height - 24, 'font', 'Mute', 16);
    game.add.bitmapText(width + 175, height - 24, 'font', 'Pause', 16);
    game.add.bitmapText(width + 275, height - 24, 'font', 'Info', 16);
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

function ending() {
        gameFinished = false;
        if(!music.paused) {
            music.pause();
            game.world.removeAll()
        }
        ending = game.add.sprite(0, 0, 'ending');
        sending.play();
        newgame = game.add.button(451, 411, 'newgamebutton', reset, this, 2, 1, 0);
}

function reset() {
    game.world.removeAll();
    sending.pause();
    ending.kill();
    create()
}