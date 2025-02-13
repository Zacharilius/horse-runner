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

enum HorseMovementDirections {
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

const horseImages = [
    ImageTag.getImage(blackGray),
    ImageTag.getImage(blackWhite),
    ImageTag.getImage(brownBlonde),
    ImageTag.getImage(brownTan),
    ImageTag.getImage(grayWhite),
    ImageTag.getImage(redBlack),
    ImageTag.getImage(redBrown),
    ImageTag.getImage(whiteWhite),
];

export default class Horse {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private obstacle: Obstacle

    private image: HTMLImageElement;
    private imageIndex = 0;

    private horseDirection: HorseMovementDirections = HorseMovementDirections.left
    private isHorseMoving = false;
    private isHorseRunning = false;
    private horseY: number;

    private isJumping: boolean;

    // Sounds
    private walkingSound: Sound;
    private runningSound: Sound;
    private neighingSound: Sound;

    constructor (
        canvas: HTMLCanvasElement,
        background: Background,
        obstacle: Obstacle,
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.background = background;
        this.obstacle = obstacle;

        this.imageIndex = Math.floor(Math.random() * horseImages.length);
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
            // TODO: Refactor key to be enum.
            if (event.key === 'ArrowUp') {
                this.startHorseMoving(HorseMovementDirections.up);
            } else if (event.key === 'ArrowDown') {
                this.startHorseMoving(HorseMovementDirections.down);
            } else if (event.key === 'ArrowLeft') {
                this.startHorseMoving(HorseMovementDirections.left);
            } else if (event.key === 'ArrowRight') {
                this.startHorseMoving(HorseMovementDirections.right);
            } else if (event.key === 's') {
                const imageIndex = (this.imageIndex + 1) % horseImages.length
                this.setHorse(imageIndex)
            } else if (event.key === 'n') {
                this.neighingSound.play();
            } else if (event.key === 'r') {
                this.isHorseRunning = true;
            } else if (event.key === ' ') {
                // TODO: Refactor: Move this logic to the tick event function.
                // It is messy having movement reaction/handle codein 2 places.
                if (!this.isJumping && this.isMovingHorizontally()) {
                    this.isJumping = true;
                    let upCount = 6;
                    const upInterval = window.setInterval(() => {
                        if (upCount <= 0) {
                            window.clearInterval(upInterval);
                            let downCount = 6;
                            const downInterval = window.setInterval(() => {
                                if (downCount <= 0) {
                                    window.clearInterval(downInterval);
                                    this.isJumping = false;
                                }
                                downCount -= 1;
                                this.horseY += 2;
                            }, 50);
                        }
                        this.horseY -= 2;
                        upCount -= 1;
                    }, 50);
                }
            }

            // Prevents scrolling when pressing arrow keys.
            event.preventDefault();
        });

        const KEY_UPS_TO_STOP_MOVEMENT = new Set<string>([
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
        ]);

        window.addEventListener('keyup', (event) => {
            if (KEY_UPS_TO_STOP_MOVEMENT.has(event.key)) {
                this.isHorseRunning = false;
                this.isHorseMoving = false;
            } else if (event.key === 'r') {
                this.isHorseRunning = false;
            }
        });
    }
    private startHorseMoving (direction: HorseMovementDirections) {
        this.horseDirection = direction;
        this.isHorseMoving = true;
    }

    private setHorse (imageIndex: number) {
        this.imageIndex = imageIndex;
        this.image = horseImages[this.imageIndex]
    }

    private handleMovementSounds () {
        if (this.canHorseMove() && (this.isHorseRunning || this.isHorseMoving)) {
            // Handling starting moving sounds;
            if (this.isHorseMoving && this.isHorseRunning) {
                // Only play 1 moving sound at a time;
                this.walkingSound.pause();
                this.runningSound.play();
            } else if (this.isHorseMoving) {
                this.walkingSound.play();
            }
        } else {
            this.runningSound.pause();
            this.walkingSound.pause();
        }
    }

    private handleMovingBackground () {
        const speed = this.getMovingSpeed();
        if (this.horseDirection === HorseMovementDirections.left) {
            this.background.startMovingLeft(speed);
        } else if (this.horseDirection === HorseMovementDirections.right) {
            this.background.startMovingRight(speed);
        } else {
            this.background.setMovingStop();
        }
    }

    private handleMovingHorseVerticaly () {
        if (this.isHorseMoving || this.isHorseRunning) {
            if (this.canHorseMoveUp()) {
                this.horseY -= 1;
            } else if (this.canHorseMoveDown()) {
                this.horseY += 1;
            }
        }
    }

    private canHorseMoveUp (): boolean {
        return this.horseDirection === HorseMovementDirections.up && (this.horseY - 1) > TOP_CANVAS_PATH;
    }

    private canHorseMoveDown (): boolean {
        return this.horseDirection === HorseMovementDirections.down && (this.horseY + 1) < BOTTOM_CANVAS_PATH;
    }

    private isMovingHorizontally (): boolean {
        return (
            this.horseDirection === HorseMovementDirections.left ||
            this.horseDirection === HorseMovementDirections.right
        );
    }

    private isMovingVertically (): boolean {
        return (
            this.horseDirection === HorseMovementDirections.up ||
            this.horseDirection === HorseMovementDirections.down
        );
    }

    private getMovingSpeed (): number {
        if (this.isHorseMoving && this.isHorseRunning) {
            return RUNNING_SPEED;
        } else if (this.isHorseMoving) {
            return WALKING_SPEED;
        } else {
            return 0;
        }
    }

    private getHorseSpriteSheetLocation (): SpriteLocation {
        if (this.isHorseMoving) {
            if (this.isHorseRunning) {
                return {
                    numColumns: 6,
                    numRows: 1,
                    row: this.horseDirection + 4,
                }
            }
            return {
                numColumns: 8,
                numRows: 1,
                row: this.horseDirection,
            }
        }
        return {
            numColumns: 3,
            numRows: 1,
            row: this.horseDirection - 8,
        }
    }

    private canHorseMove (): boolean {
        if (this.isHorseMoving) {
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

    private setupEventListener () {
        let currentFrame = 0;
		this.canvas.addEventListener('tick', () => {
            this.handleMovementSounds();
            this.handleMovingBackground();
            this.handleMovingHorseVerticaly();

            if (this.canHorseMove()) {
                // Pick a new frame
                currentFrame++;
            }

            const { numColumns, numRows, row } = this.getHorseSpriteSheetLocation();

            // Make the frames loop
            const maxFrame = numColumns * numRows - 1;
            if (currentFrame > maxFrame){
                currentFrame = 0;
            }

            // Update rows and columns in sprite sheet
            const column = currentFrame % numColumns;

            const horseBoundingBox = this.getHorseBoundingBox()
            if (isCollision(
                horseBoundingBox,
                this.obstacle.getBoundingBox(),
            )) {
                // Bounding Box
                this.context.fillStyle = 'red';
                this.context.fillRect(
                    horseBoundingBox.left,
                    horseBoundingBox.top,
                    horseBoundingBox.width,
                    horseBoundingBox.height,
                );
            }

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

    private getHorseBoundingBox (): BoundingBox {
        // Covers the legs;
        const top = this.horseY + (FRAME_HEIGHT * .8);
        // .2 Covers the legs
        const height = FRAME_HEIGHT * .2
        if (this.isMovingVertically()) {
            return {
                left: ((this.canvas.width / 2) - (FRAME_WIDTH / 2)) + FRAME_WIDTH / 2.5,  // todo less magic
                top,
                width: FRAME_WIDTH / 5,
                height
            }
        } else {
            return {
                left: ((this.canvas.width / 2) - (FRAME_WIDTH / 2)) + FRAME_WIDTH / 2.8,  // todo less magic
                top,
                width: FRAME_WIDTH / 3,
                height
            }
        }
    }
}
