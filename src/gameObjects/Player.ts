export class Player extends Phaser.Physics.Arcade.Sprite {
  private initY: number;
  private isJumping = false;
  private jumpFramePixels = 10;
  private jumpTime = 500;

  constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'whiteBodyWhiteManeHorse');
        this.initY = y;
        this.setScale(4);
        scene.add.existing(this);

        this.initAnimations();
  }
  initAnimations() {
    this.anims.create({
        key: 'left',
        // 24 rows & 8 columns
        // Frames for 2 rows...
        frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', { start: 64, end: 71}),
        frameRate: 25,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'whiteBodyWhiteManeHorse', frame: 16 }],
        frameRate: 1,
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', { start: 72, end: 79 }),
        frameRate: 25,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', { start: 72, end: 79 }),
        frameRate: 25,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('whiteBodyWhiteManeHorse', { start: 72, end: 79 }),
        frameRate: 25,
        repeat: -1
    });
  }
  moveLeft() {
    this.anims.play('left', true);
  }
  moveRight() {
    this.anims.play('right', true);
  }
  moveUp() {
    this.anims.play('up', true);
  }
  moveDown() {
    this.anims.play('down', true);
  }
  idle() {
    this.anims.play('turn');
  }
  startJumping(time: any) {
    if (!this.isJumping && this.isPlayerOnGround()) {
        console.log('Jumping');
        this.isJumping = true;
        time.delayedCall(this.jumpTime, () => {
          this.isJumping = false;
        });
    }
  }
  handleJumping() {
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