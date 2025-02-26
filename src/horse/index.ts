import blackGray from './images/blackBodyGrayManeHorse.png';
import blackWhite from './images/blackBodyWhiteManeHorse.png';
import brownBlonde from './images/brownBodyBlondeManeHorse.png'
import brownTan from './images/brownBodyTanManeHorse.png';
import grayWhite from './images/grayBodyWhiteManeHorse.png';
import redBlack from './images/redBodyBlackManeHorse.png';
import redBrown from './images/redBodyBrownManeHorse.png';
import whiteWhite from './images/whiteBodyWhiteManeHorse.png';

import horseGalloping from './sounds/horse-galloping.wav';
import horseNeighing from './sounds/horse-neigh.mp3';
import horseWalking from './sounds/horse-walking.mp3';

import ImageTag from '../image'
import Background from '../background';
import Sound from '../sound';
import { BoundingBox, isCollision } from '../bounding-box';
import Obstacle from '../obstacle';

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 48;

const TOP_CANVAS_PATH = 60;
const BOTTOM_CANVAS_PATH = 85;

export enum HorseMovementDirections {
    left = 8,
    right = 9,
    down = 10,
    up = 11,
}

const WALKING_SPEED = 15;
const RUNNING_SPEED = 45;

interface SpriteLocation {
    numColumns: number;
    numRows: number;
    row: number;
}

const horseImages: HTMLImageElement[] = [];

const preloadAssets = async () => {
    const horseImagesResult = await Promise.all([
        ImageTag.getImage(blackGray),
        ImageTag.getImage(blackWhite),
        ImageTag.getImage(brownBlonde),
        ImageTag.getImage(brownTan),
        ImageTag.getImage(grayWhite),
        ImageTag.getImage(redBlack),
        ImageTag.getImage(redBrown),
        ImageTag.getImage(whiteWhite),
    ]);
    horseImagesResult.forEach(horseImage => {
        horseImages.push(horseImage);
    });
}

enum Keys {
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
};

export default class Horse {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private obstacle: Obstacle

    private image: HTMLImageElement;
    private imageIndex = 0;

    private movementKeysPressed = new Set<Keys>();
    private isHorseRunning = false;
    private horseY: number;

    private isJumping: boolean;
    private isJumpingUpCount = 0;
    private isJumpingDownCount = 0;

    // Sounds
    private walkingSound: Sound;
    private runningSound: Sound;
    private neighingSound: Sound;

    private isDying = false;

    // Constructor
    static async create (
        canvas: HTMLCanvasElement,
        background: Background,
        obstacle: Obstacle
    ): Promise<Horse> {
        // Only load assets the first time.
        if (horseImages.length === 0) {
            await preloadAssets();
        }
        return new Horse(canvas, background, obstacle);
    }

    // Do not construct. use static create() constructor to ensure assets are fully loaded.
    constructor (
        canvas: HTMLCanvasElement,
        background: Background,
        obstacle: Obstacle,
    ) {
        if (horseImages.length === 0) {
            throw Error('Loading without preloaded assets');
        }
        this.canvas = canvas;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.background = background;
        this.obstacle = obstacle;

        this.imageIndex = 0;
        this.image = horseImages[this.imageIndex];

        // Initialize in center of the path
        this.horseY = TOP_CANVAS_PATH - (TOP_CANVAS_PATH - BOTTOM_CANVAS_PATH) / 2;

        this.isJumping = false;

        this.walkingSound = new Sound(horseWalking);
        this.runningSound = new Sound(horseGalloping);
        this.neighingSound = new Sound(horseNeighing);

        this.setupKeyPress();
        this.setupEventListener();   
    }

    private setupKeyPress () {
        window.addEventListener('keydown', (event) => {
            if (this.isDying) {
                return
            }
            if (event.key === Keys.ArrowUp) {
                this.startHorseMoving(event.key);
            } else if (event.key === Keys.ArrowDown) {
                this.startHorseMoving(event.key);
            } else if (event.key === Keys.ArrowLeft) {
                this.startHorseMoving(event.key);
            } else if (event.key === Keys.ArrowRight) {
                this.startHorseMoving(event.key);
            } else if (event.key === 's') {
                const imageIndex = (this.imageIndex + 1) % horseImages.length
                this.setHorse(imageIndex)
            } else if (event.key === 'n') {
                this.neighingSound.play();
            } else if (event.key === 'r') {
                this.isHorseRunning = true;
            } else if (event.key === ' ') {
                if (!this.isJumping) {
                    this.isJumping = true;
                }
            }

            // Prevents scrolling when pressing arrow keys.
            event.preventDefault();
        });

        window.addEventListener('keyup', (event) => {
            if (Object.values(Keys).includes(event.key as Keys)) {
                this.stopHorseMoving(event.key as Keys);
            } else if (event.key === 'r') {
                this.isHorseRunning = false;
            }
        });
    }
    private startHorseMoving (key: Keys) {
        this.movementKeysPressed.add(key);
    }

    private stopHorseMoving (key: Keys) {
        this.movementKeysPressed.delete(key);
        // If no movement keys are pressed
        // Then stop running
        if (this.movementKeysPressed.size == 0) {
            this.isHorseRunning = false;
        }
    }

    private isMovementKeyDown (): boolean {
        return this.movementKeysPressed.size > 0;
    }

    private setHorse (imageIndex: number) {
        this.imageIndex = imageIndex;
        this.image = horseImages[this.imageIndex]
    }

    private handleMovementSounds () {
        if (this.canHorseMove() && (this.isHorseRunning || this.isMovementKeyDown())) {
            // Handling starting moving sounds;
            if (this.isMovementKeyDown() && this.isHorseRunning) {
                // Only play 1 moving sound at a time;
                this.walkingSound.pause();
                this.runningSound.play();
            } else if (this.isMovementKeyDown()) {
                this.walkingSound.play();
            }
        } else {
            this.runningSound.pause();
            this.walkingSound.pause();
        }
    }

    private handleMovingBackground () {
        const speed = this.getMovingSpeed();
        if (this.isDying) {
            this.background.setMovingStop();
        } else {
            if (this.movementKeysPressed.has(Keys.ArrowLeft)) {
                this.background.startMovingLeft(speed);
            } else if (this.movementKeysPressed.has(Keys.ArrowRight)) {
                this.background.startMovingRight(speed);
            } else {
                this.background.setMovingStop();
            }
        }
    }

    private handleMovingHorseVerticaly () {
        if (this.isMovementKeyDown() || this.isHorseRunning) {
            if (this.canHorseMoveUp()) {
                this.horseY -= 1;
            } else if (this.canHorseMoveDown()) {
                this.horseY += 1;
            }
        }
    }

    private canHorseMoveUp (): boolean {
        return this.movementKeysPressed.has(Keys.ArrowUp) && (this.horseY - 1) > TOP_CANVAS_PATH;
    }

    private canHorseMoveDown (): boolean {
        return this.movementKeysPressed.has(Keys.ArrowDown) && (this.horseY + 1) < BOTTOM_CANVAS_PATH;
    }

    private isMovingHorizontally (): boolean {
        return (
            this.movementKeysPressed.has(Keys.ArrowLeft) ||
            this.movementKeysPressed.has(Keys.ArrowRight)
        );
    }

    private isMovingVertically (): boolean {
        return (
            this.movementKeysPressed.has(Keys.ArrowUp) ||
            this.movementKeysPressed.has(Keys.ArrowDown)
        );
    }

    private getMovingSpeed (): number {
        if (this.isMovementKeyDown() && this.isHorseRunning) {
            return RUNNING_SPEED;
        } else if (this.isMovementKeyDown()) {
            return WALKING_SPEED;
        } else {
            return 0;
        }
    }

    private getHorseSpriteSheetLocation (): SpriteLocation {
        const horseDirection = this.getHorseDirection();

        if (this.isDying) {
            return {
                numColumns: 6,
                numRows: 1,
                row: horseDirection + 12,
            }
        } else if (this.isMovementKeyDown()) {
            if (this.isHorseRunning) {
                return {
                    numColumns: 6,
                    numRows: 1,
                    row: horseDirection + 4,
                }
            }
            return {
                numColumns: 8,
                numRows: 1,
                row: horseDirection,
            }
        } else {
            return {
                numColumns: 3,
                numRows: 1,
                row: horseDirection - 8,
            }
        }
    }

    private getHorseDirection (): HorseMovementDirections {
        // If multiple keys are down, use the horizontal image.
        if (this.isMovingHorizontally()) {
            if (this.movementKeysPressed.has(Keys.ArrowLeft)) {
                return HorseMovementDirections.left
            } else {
                return HorseMovementDirections.right;
            }
        } else if (this.isMovingVertically()) {
            if (this.movementKeysPressed.has(Keys.ArrowUp)) {
                return HorseMovementDirections.up
            } else {
                return HorseMovementDirections.down;
            }
        }
        // TODO: This causes the horse to always look left after the key is
        // unpressed.
        return HorseMovementDirections.left
    }

    private canHorseMove (): boolean {
        if (this.isMovementKeyDown()) {
            // Horse must stay on the path. Do not let it run in place
            if (this.isMovingVertically()) {
                if (this.canHorseMoveUp() || this.canHorseMoveDown()) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // Can always move horizontally if isHorseMoving.
                return true;
            }
        }
        return false;
    }

    private handleJumping () {
        const COUNT_FRAMES_TO_GO_UP_OR_DOWN = 6;
        if (this.isJumping) {
            const isStartOfJump = (
                this.isJumpingUpCount == 0 &&
                this.isJumpingDownCount == 0
            );
            if (isStartOfJump) {
                this.isJumpingUpCount = COUNT_FRAMES_TO_GO_UP_OR_DOWN;
            }

            if (this.isJumpingUpCount > 0) {
                this.isJumpingUpCount -= 1;
                this.horseY -= 2;

                // On last up jump tick signal next tick to start jumping down.
                if (this.isJumpingUpCount === 0) {
                    this.isJumpingDownCount = COUNT_FRAMES_TO_GO_UP_OR_DOWN;
                }
            } else if (this.isJumpingDownCount > 0) {
                this.isJumpingDownCount -= 1;
                this.horseY += 2;

                // On last jump tick stop jumping.
                if (this.isJumpingDownCount === 0) {
                    this.isJumping = false;
                }
            }
        }
    }

    private setupEventListener () {
        let currentFrame = 0;

        let hasStartedDying = false;
        let hasFinishedDying = false;

		this.canvas.addEventListener('tick', () => {
            this.handleMovementSounds();
            this.handleMovingBackground();
            this.handleMovingHorseVerticaly();
            this.handleJumping();
            this.handleObstacleCollision();

            if (this.isDying) {
                if (!hasStartedDying) {
                    hasStartedDying = true;
                    currentFrame = 0;
                } else if (!hasFinishedDying) {
                    if (currentFrame < 5) {
                        currentFrame++;
                    } else {
                        hasFinishedDying = true;
                    }
                }

            } else if (this.isMovementKeyDown()) {
                // Pick a new frame
                currentFrame++;
            }

            const { numColumns, numRows, row } = this.getHorseSpriteSheetLocation();

            // Make the frames loop
            const maxFrame = numColumns * numRows - 1;
            if (currentFrame > maxFrame) {
                currentFrame = 0;
            }

            // Update rows and columns in sprite sheet
            const column = currentFrame % numColumns;

            this.context.drawImage(
                this.image,
                column * FRAME_WIDTH,
                row * FRAME_HEIGHT,
                FRAME_WIDTH,
                FRAME_HEIGHT,
                (this.canvas.width / 2) - (FRAME_WIDTH / 2),
                this.horseY,
                FRAME_WIDTH,
                FRAME_HEIGHT,
            );
        });
    }

    private handleObstacleCollision () {
        const horseBoundingBox = this.getHorseBoundingBox();
        const isColliding = isCollision(
            horseBoundingBox,
            this.obstacle.getBoundingBox(),
        );
        if (isColliding || this.isDying) {
            this.isDying = true;
            this.context.fillStyle = 'red';
            this.context.fillRect(
                horseBoundingBox.left,
                horseBoundingBox.top,
                horseBoundingBox.width,
                horseBoundingBox.height,
            );
        }
    }

    private getHorseBoundingBox (): BoundingBox {
        // Covers the legs;
        if (this.isMovingVertically()) {
            return {
                left: ((this.canvas.width / 2) - (FRAME_WIDTH / 2)) + FRAME_WIDTH / 2.5,  // todo less magic
                top: this.horseY + (FRAME_HEIGHT * .8),
                width: FRAME_WIDTH / 5,
                height: FRAME_HEIGHT * .2
            }
        } else {
            return {
                left: ((this.canvas.width / 2) - (FRAME_WIDTH / 2)) + FRAME_WIDTH / 2.8,  // todo less magic
                top: this.horseY + (FRAME_HEIGHT * .9),
                width: FRAME_WIDTH / 3,
                height: FRAME_HEIGHT * .1
            }
        }
    }

    // =========================================================================
    // Testing

    public _getHorseState () {
        return {
            canvas: this.canvas,
            context: this.context,
            background: this.background,
            obstacle: this.obstacle,
            image: this.image,
            imageIndex: this.imageIndex,
            horseDirection: this.getHorseDirection(),
            isHorseMoving: this.isMovementKeyDown(),
            isHorseRunning: this.isHorseRunning,
            horseY: this.horseY,
            isJumping: this.isJumping,
            isDying: this.isDying,
            walkingSound: this.walkingSound,
            runningSound: this.runningSound,
            neighingSound: this.neighingSound,
        };
    }
}
