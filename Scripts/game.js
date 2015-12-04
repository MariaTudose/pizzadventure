var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player;
var platforms;

function preload() {

    game.load.image('land', 'images/land.png');
    game.load.spritesheet('pizza', 'images/pizza.png', 35, 30);

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 20, 'land');
    ground.body.immovable = true;

    var ceiling = platforms.create(0, 0, 'land');
    ceiling.body.immovable = true;

    var leftWall = platforms.create(0, 0, 'land');
    leftWall.body.immovable = true;

    var rightWall = platforms.create(0, 0, 'land');
    rightWall.body.immovable = true;

    platforms.setAll(body.immovable, true)

    player = game.add.sprite(10, game.world.height - 70, 'pizza');
    game.physics.arcade.enable(player);

    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {


    game.physics.arcade.collide(player, platforms);


    player.body.velocity.x = 0;



    if (cursors.left.isDown) {
        player.body.velocity.x = -350;
        if(player.body.touching.down) player.animations.play('left');
        else player.frame = 1;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 350;
        if(player.body.touching.down) player.animations.play('right');
        else player.frame = 7;
    }
    else{
        player.animations.stop();
        if(player.body.touching.down) player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -300;
    }


    //Check overlap:
    //game.physics.arcade.overlap(player, items, collectItem, null, this);


}


//function collectItem (player, item) {
    //  item.kill();
//}
