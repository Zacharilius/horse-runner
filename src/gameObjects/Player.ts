const FRAME_RATE = 25;
const FRAME_REPEAT = 1;

const SHEET_COLUMNS = 8;
const RUN_SPRITE_SHEET_COLUMNS = 5;
const WALK_SPRITE_SHEET_COLUMNS = 7;
const LEFT_WALK_SPRITE_SHEET_START = 8 * SHEET_COLUMNS;
const LEFT_RUN_SPRITE_SHEET_START = 12 * SHEET_COLUMNS;
const RIGHT_WALK_SPRITE_SHEET_START = 9 * SHEET_COLUMNS;
const RIGHT_RUN_SPRITE_SHEET_START = 13 * SHEET_COLUMNS;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private initY: number;
  private isJumping = false;
  private jumpFramePixels = 4;
  private jumpTime = 250;

  constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'whiteBodyWhiteManeHorse');
        this.initY = y;
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
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', { start: 72, end: 79 }),
        frameRate: FRAME_RATE,
        repeat: FRAME_REPEAT
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', { start: 72, end: 79 }),
        frameRate: FRAME_RATE,
        repeat: FRAME_REPEAT
    });
  }
  public walkLeft() {
    this.anims.play('leftWalk', true);
  }
  public runLeft() {
    this.anims.play('leftRun', true);
  }
  public walkRight() {
    this.anims.play('rightWalk', true);
  }
  public runRight() {
    this.anims.play('rightRun', true);
  }
  public moveUp() {
    this.anims.play('up', true);
  }
  public moveDown() {
    this.anims.play('down', true);
  }
  public idle() {
    this.anims.play('turn');
  }
  public startJumping(time: Phaser.Time.Clock) {
    if (!this.isJumping && this.isPlayerOnGround()) {
        this.isJumping = true;
        time.delayedCall(this.jumpTime, () => {
          this.isJumping = false;
        });
    }
  }
  public handleJumping() {
    if (this.isJumping) {
        this.y -= this.jumpFramePixels; // Move up
    } else {
        if (!this.isPlayerOnGround()) {
            this.y += this.jumpFramePixels; // Move down
        }
    }
  }
  private isPlayerOnGround(): boolean {
    return this.y == this.initY
  }
}