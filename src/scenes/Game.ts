import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';

const backgroundScale = 0.3;

export class Game extends Scene {
    private backgroundGroup: Phaser.GameObjects.Group | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;;
    private rKey: Phaser.Input.Keyboard.Key | undefined;
    private spaceKey: Phaser.Input.Keyboard.Key | undefined;
    private player: Player | undefined;

    private obstacles: Phaser.Physics.Arcade.Group | undefined;

    private walkVelocity = 10;
    private runVelocity = 20;

    private isPlayerDead = false;

    constructor () {
        super('Game');
    }

    init () {
        this.isPlayerDead = false;
        if (this?.input?.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        } else {
            console.error('Keyboard input not available');
        }
    }

    create () {
        const { width, height } = this.scale
        
        this.backgroundGroup = this.backgroundGroup = this.add.group();
        this.backgroundGroup.add(this.add.tileSprite(0, 200, 5000, 704,'hillsBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));
        this.backgroundGroup.add(this.add.tileSprite(0, 50, 5000, 1242, 'treesBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));
        this.backgroundGroup.add(this.add.tileSprite(0, 305, 5000, 992, 'trailBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));

        this.player = new Player(this, width / 2, (height / 2) + 75);
        this.physics.world.enable(this.player);
        this.player.body?.setSize(32, 20);
        this.player.body?.setOffset(16, 26);

        this.obstacles = this.physics.add.group();
        this.physics.world.enable(this.obstacles);

        this.physics.add.collider(this.player, this.obstacles, this.hitObstacle  as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        this.addObstacle()
    }

    hitObstacle (
        player: Player,
        obstacle: Phaser.GameObjects.Sprite
    ) {
        this.isPlayerDead = true;
        this.physics.pause();
        player.setTint(0xff0000);
        obstacle.setTint(0xff0000);

        player.play('turn');
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOver');
        });
    }

    addObstacle () {
        // TODO: Make random and offscreen
        const { width, height } = this.scale
        const obstacle = this.add.sprite(width - 100, height - 100, 'obstacle');
        obstacle.setScale(0.5);
        this.obstacles?.add(obstacle);
    }

    update () {
        if (this.isPlayerDead) {
            this.player?.dead();
            return;
        }

        let isRunning = false;
        if (this?.rKey?.isDown) {
            isRunning = true;
        }

        let velocityX: number;
        if (this.cursors?.left.isDown) {
            if (isRunning) {
                this.player?.runLeft();
                velocityX = -(this.runVelocity);
            } else {
                this.player?.walkLeft();
                velocityX = -(this.walkVelocity);
            }
        } else if (this.cursors?.right.isDown) {
            if (isRunning) {
                this.player?.runRight();
                velocityX = this.runVelocity;
            } else {
                this.player?.walkRight();
                velocityX = this.walkVelocity;
            }
        } else if (this.cursors?.up.isDown) {
            this.player?.moveUp();
            velocityX = 0;
        } else if (this.cursors?.down.isDown) {
            this.player?.moveDown();
            velocityX = 0;
        } else {
            this.player?.idle();
            velocityX = 0;
        }
    
        // Start Jumping
        if (this.spaceKey?.isDown) {
            this.player?.startJumping();
        }
        // Continue Jumping
        this.player?.handleJumping();

        // Background Scrolling
        this?.backgroundGroup?.getChildren().forEach((layer) => {
            const tileSprite = layer as Phaser.GameObjects.TileSprite;
            tileSprite.tilePositionX += velocityX;
        });

        // Obstacle Scrolling
        this?.obstacles?.getChildren().forEach((obstacle) => {
            const obstacleSprite = obstacle as Phaser.GameObjects.Sprite;
            obstacleSprite.x -= (velocityX * backgroundScale);
        });
    }
}
