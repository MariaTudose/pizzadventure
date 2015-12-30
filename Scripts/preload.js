function preload() {

    game.load.image('logo', 'images/logo.png');
    game.load.audio('music', ['audio/music.ogg']);
    game.load.audio('achimusic', ['audio/achi.wav']);
    game.load.audio('jump', ['audio/jump.ogg']);
    game.load.audio('booster', ['audio/booster.ogg']);
    game.load.audio('death', ['audio/death.ogg']);
    game.load.audio('ball', ['audio/ball.ogg']);
    game.load.audio('menubutton', ['audio/menubutton.ogg']);
    game.load.audio('button', ['audio/button.ogg']);
    game.load.audio('teleport', ['audio/teleport.ogg']);
    game.load.audio('disappear', ['audio/dissappear.ogg']);
    game.load.audio('appear', ['audio/appear.ogg']);
    game.load.image('block', 'images/block.png');
    game.load.image('mblock', 'images/mblock.png');
    game.load.image('achi', 'images/achi.png');
    game.load.image('menu', 'images/menu2.png');
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