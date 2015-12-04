var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {

    //Load images here

    //Example:
    //game.load.image('logo', 'phaser.png');

}

function create() {

    //Add physics
    game.physics.startSystem(Phaser.Physics.ARCADE);


    //Add sprites (game objects)

    //Example:
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);


}

function update() {

    //Called every frame

    //Collision check:
    //game.physics.arcade.collide(player, platforms);

    //Check overlap:
    //game.physics.arcade.overlap(player, items, collectItem, null, this);


}


//function collectItem (player, item) {
    //  item.kill();
//}
