const FRAME_RATE = 25;
const FRAME_REPEAT = 1;

const SHEET_COLUMNS = 8;
const RUN_SPRITE_SHEET_COLUMNS = 5;
const WALK_SPRITE_SHEET_COLUMNS = 7;
const LEFT_WALK_SPRITE_SHEET_START = 8 * SHEET_COLUMNS;
const LEFT_RUN_SPRITE_SHEET_START = 12 * SHEET_COLUMNS;
const RIGHT_WALK_SPRITE_SHEET_START = 9 * SHEET_COLUMNS;
const RIGHT_RUN_SPRITE_SHEET_START = 13 * SHEET_COLUMNS;
const UP_WALK_SPRITE_SHEET_START = 11 * SHEET_COLUMNS;
const DOWN_WALK_SPRITE_SHEET_START = 10 * SHEET_COLUMNS;

const MAX_TRAIL_TOP = 305;
const MAX_TRAIL_BOTTOM = 420;

export class Player extends Phaser.Physics.Arcade.Sprite {
    private isJumping = false;
    private isJumpingUp = false;
    private isJumpingDown = false;
    private jumpFramePixels = 4;
    private jumpTime = 250;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'whiteBodyWhiteManeHorse');
        this.setScale(4);
        scene.add.existing(this);

        this.initAnimations();
    }
    private initAnimations() {
        // Left
        this.anims.create({
            key: 'leftWalk',
            frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', {
                start: LEFT_WALK_SPRITE_SHEET_START,
                end: LEFT_WALK_SPRITE_SHEET_START + WALK_SPRITE_SHEET_COLUMNS}),
            frameRate: FRAME_RATE,
            repeat: FRAME_REPEAT
        });
        this.anims.create({
            key: 'leftRun',
            frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', {
                start: LEFT_RUN_SPRITE_SHEET_START,
                end: LEFT_RUN_SPRITE_SHEET_START + RUN_SPRITE_SHEET_COLUMNS }),
            frameRate: FRAME_RATE,
            repeat: FRAME_REPEAT
        });

        // Turn
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'whiteBodyWhiteManeHorse', frame: 16 }],
            frameRate: FRAME_REPEAT,
        });

        // Right
        this.anims.create({
            key: 'rightWalk',
            frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', {
                start: RIGHT_WALK_SPRITE_SHEET_START,
                end: RIGHT_WALK_SPRITE_SHEET_START + WALK_SPRITE_SHEET_COLUMNS }),
            frameRate: FRAME_RATE,
            repeat: FRAME_REPEAT
        });
        this.anims.create({
            key: 'rightRun',
            frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', {
                start: RIGHT_RUN_SPRITE_SHEET_START,
                end: RIGHT_RUN_SPRITE_SHEET_START + RUN_SPRITE_SHEET_COLUMNS
            }),
            frameRate: FRAME_RATE,
            repeat: FRAME_REPEAT
        });

        // Up
        this.anims.create({
            key: 'up',
            // 10 down 11 up
            frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', {
                start: UP_WALK_SPRITE_SHEET_START,
                end: UP_WALK_SPRITE_SHEET_START + WALK_SPRITE_SHEET_COLUMNS
            }),
            frameRate: FRAME_RATE,
            repeat: FRAME_REPEAT
        });

        // Down
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', {
                start: DOWN_WALK_SPRITE_SHEET_START,
                end: DOWN_WALK_SPRITE_SHEET_START + WALK_SPRITE_SHEET_COLUMNS
            }),
            frameRate: FRAME_RATE,
            repeat: FRAME_REPEAT
        });
    }
    public walkLeft() {
        this.anims.play('leftWalk', true);
        this.playWalkingSound();
    }
    public runLeft() {
        this.anims.play('leftRun', true);
        this.playGallopingSound();
    }
    public walkRight() {
        this.anims.play('rightWalk', true);
        this.playWalkingSound();

    }
    public runRight() {
        this.anims.play('rightRun', true);
        this.playGallopingSound();
    }
    public moveUp() {
        if (!this.isJumpInProgress() && this.y - 1 > MAX_TRAIL_TOP) {
            this.anims.play('up', true);
            this.playWalkingSound();
            this.y -= 1;
        } else {
            this.stopGallopingSound();
            this.stopWalkingSound();
        }
    }
    public moveDown() {
        if (!this.isJumpInProgress() && this.y + 1 < MAX_TRAIL_BOTTOM) {
            this.anims.play('down', true);
            this.playWalkingSound();
            this.y += 1;
        } else {
            this.stopGallopingSound();
            this.stopWalkingSound();
        }
    }
    public idle() {
        this.anims.play('turn');
        this.stopWalkingSound();
        this.stopGallopingSound();
    }
    public startJumping() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.isJumpingUp = true;
            this.isJumpingDown = false;
            this.scene.time.delayedCall(this.jumpTime, () => {
                this.isJumpingUp = false;
                this.isJumpingDown = true;
                this.scene.time.delayedCall(this.jumpTime, () => {
                    this.isJumpingDown = false;
                    this.isJumping = false;
                });

            });
        }
    }
    public handleJumping() {
        if (this.isJumpingUp) {
            this.y -= this.jumpFramePixels; // Move up
        } else if (this.isJumpingDown) {
            this.y += this.jumpFramePixels; // Move down
        }
    }
    private isJumpInProgress() {
        return this.isJumping;
    }
    private playWalkingSound() {
        // Only play walking sound if not galloping
        this.stopGallopingSound();
        if (!this.scene.sound.isPlaying('walking')) {
            this.scene.sound.play('walking');
        }
    }
    private playGallopingSound() {
        // Only play galloping sound if not walking
        this.stopWalkingSound();
        if (!this.scene.sound.isPlaying('galloping')) {
            this.scene.sound.play('galloping');
        }
    }
    private stopWalkingSound() {
        if (this.scene.sound.isPlaying('walking')) {
            this.scene.sound.stopByKey('walking');
        }
    }
    private stopGallopingSound() {
        if (this.scene.sound.isPlaying('galloping')) {
            this.scene.sound.stopByKey('galloping');
        }
    }
}
