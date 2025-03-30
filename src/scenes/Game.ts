import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';

export class Game extends Scene {
    private backgroundGroup: Phaser.GameObjects.Group | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;;
    private rKey: Phaser.Input.Keyboard.Key | undefined;
    private player: Player | undefined;

    private walkVelocity = 10;
    private runVelocity = 20;

    constructor () {
        super('Game');
    }

    init () {
        if (this?.input?.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        } else {
            console.error('Keyboard input not available');
        }
    }

    create () {
        const { width, height } = this.scale
        
        this.backgroundGroup = this.backgroundGroup = this.add.group();
        const backgroundScale = 0.3;
        this.backgroundGroup.add(this.add.tileSprite(0, 200, 5000, 704,'hillsBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));
        this.backgroundGroup.add(this.add.tileSprite(0, 50, 5000, 1242, 'treesBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));
        this.backgroundGroup.add(this.add.tileSprite(0, 305, 5000, 992, 'trailBackground').setOrigin(0, 0).setScale(backgroundScale).setScrollFactor(0, 0));

        this.player = new Player(this, width / 2, (height / 2) + 75);
    }

    update () {
        let isRunning = false;
        if (this?.rKey?.isDown) {
            isRunning = true;
        }

        let velocityX;
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
        } else {
            this.player?.idle();
            velocityX = 0;
        }
    
        // Start Jumping
        if (this.cursors?.up.isDown) {
            this.player?.startJumping(this.time);
        }
        // Continue Jumping
        this.player?.handleJumping();

        // Background Scrolling
        this?.backgroundGroup?.getChildren().forEach((layer) => {
            const tileSprite = layer as Phaser.GameObjects.TileSprite;
            tileSprite.tilePositionX += velocityX;
        });
    }
}
