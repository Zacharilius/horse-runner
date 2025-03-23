import { Scene } from 'phaser';
// import { Player } from '../gameObjects/Player';

export class Game extends Scene {
    private backgroundGroup: Phaser.GameObjects.Group;
    // private platforms: Phaser.Physics.Arcade.StaticGroup;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private player: Player | undefined;
    // private stars: Phaser.Physics.Arcade.Group;
    // private bombs: Phaser.Physics.Arcade.Group;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text | undefined;
    // camera: Phaser.Cameras.Scene2D.Camera;
    // background: Phaser.GameObjects.Image;
    // msg_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    preload () {
        this.load.image('snowman', 'assets/Snowman.png')
    }

    init () {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create ()
    {
        const { width, height } = this.scale

        
        this.backgroundGroup = this.backgroundGroup = this.add.group();
        const backgroundScale = 0.3;
        this.backgroundGroup.add(this.add.tileSprite(0, 200, 5000, 704,'hillsBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));
        this.backgroundGroup.add(this.add.tileSprite(0, 50, 5000, 1242, 'treesBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));
        this.backgroundGroup.add(this.add.tileSprite(0, 305, 5000, 992, 'trailBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));


        // this.add.image(400, 300, 'sky');

        // this.platforms = this.physics.add.staticGroup();
        // this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        // this.platforms.create(600, 400, 'ground');
        // this.platforms.create(50, 250, 'ground');
        // this.platforms.create(750, 220, 'ground');

        // this.player = new Player(this, gameWidth / 2, 0);
        this.player = this.add.image(width * 0.5, height * 0.5, 'snowman')
            .setOrigin(0.5, 1)
            .setScale(2);


        // Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 145)
        // this.cameras.main.setBounds(0, 0, gameWidth, gameHeight);

        // this.physics.add.collider(this.player, this.platforms);

        // this.stars = this.physics.add.group({
        //     key: 'star',
        //     repeat: 11,
        //     setXY: { x: 12, y: 0, stepX: 70 }
        // });
        // this.stars.children.iterate(child => {
        //     const star = child as Phaser.Physics.Arcade.Image;
        //     star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // });
        // this.physics.add.collider(this.stars, this.platforms);
        // this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        // this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // this.bombs = this.physics.add.group();
        // this.physics.add.collider(this.bombs, this.platforms);
        // this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);  
    }

    update () {
        let velocityX;
        if (this.cursors?.left.isDown) {
            // this.player?.moveLeft();
            velocityX = -10;    
        } else if (this.cursors?.right.isDown) {
            // this.player?.moveRight();
            velocityX = 10;
        } else {
            // this.player?.idle();
            velocityX = 0;
        }
        
        if (this.cursors?.up.isDown) {
            // this.player?.jump();
        }

        this.player.x += velocityX;

        // Background Scrolling
        this.backgroundGroup.getChildren().forEach((layer) => {
            console.log('fixme here', this.cameras.main.scrollX);
            layer.tilePositionX = this.cameras.main.scrollX * 0.3; // Adjust scroll speed
        });
    }

    // collectStar(_player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
    //     star.disableBody(true, true);
    //     this.score += 10;
    //     this.scoreText?.setText('Score: ' + this.score);

    //     if (this.stars.countActive(true) === 0) {
    //         this.stars.children.iterate(child => {
    //             const star = child as Phaser.Physics.Arcade.Image;
    //             star.enableBody(true, star.x, 0, true, true);
    //         });

    //         this.releaseBomb();
    //     }
    // }

    // hitBomb(_player: Phaser.GameObjects.GameObject, _bomb: Phaser.GameObjects.GameObject) {      
    //     this.physics.pause();
    //     this.player?.setTint(0xff0000);
    //     this.player?.play('turn');
    //     this.time.delayedCall(2000, () => {
    //         this.scene.start('GameOver');
    //     });
    // }

    // releaseBomb() {
    //     const x = (this.player?.x < 400) ? Phaser.Math.Between(400, 800): Phaser.Math.Between(0, 400);
    //     const bomb = this.bombs.create(x, 16, 'bomb');
    //     bomb.setBounce(1);
    //     bomb.setCollideWorldBounds(true);
    //     bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    // }
}
