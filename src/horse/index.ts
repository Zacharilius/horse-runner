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

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 48;

enum HorseMovementDirections {
    left = 8,
    right = 9,
    down = 10,
    up = 11,
}

const BackgroundMovementDirections = new Set([
    HorseMovementDirections.left,
    HorseMovementDirections.right,
]);

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
    private image: HTMLImageElement;
    private imageIndex: number = 0;

    private horseDirection: HorseMovementDirections = HorseMovementDirections.left
    private isHorseMoving: boolean = false;
    private isHorseRunning: boolean = false;

    // Sounds
    private walkingSound: Sound;
    private runningSound: Sound;
    private neighingSound: Sound;

    constructor (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        background: Background,
    ) {
        this.canvas = canvas;
        this.context = context;
        this.background = background;
        this.imageIndex = Math.floor(Math.random() * horseImages.length);
        this.image = horseImages[this.imageIndex];

        this.walkingSound = Sound.createAutoPlayLoop(horseWalking);
        this.runningSound = Sound.createAutoPlayLoop(horseGalloping);
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
            } else if (event.key === ' ') {
                const imageIndex = (this.imageIndex + 1) % horseImages.length
                this.setHorse(imageIndex)
            } else if (event.key === 'n') {
                this.neighingSound.play();
            } else if (event.key === 'r') {
                this.isHorseRunning = true;
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
        // Handling stoping sounds;
        if (!this.isHorseRunning) {
            this.runningSound.stop();
        }
        if (!this.isHorseMoving) {
            this.walkingSound.stop();
        }

        // Handling starting moving sounds;
        if (this.isHorseMoving && this.isHorseRunning) {
            // Only play 1 moving sound at a time;
            this.walkingSound.stop();
            this.runningSound.play();
        } else if (this.isHorseMoving) {
            this.walkingSound.play();
        }
    }

    private handleMovingBackground () {
        const shouldMoveBackground = BackgroundMovementDirections.has(this.horseDirection);
        if (shouldMoveBackground) {
            if (this.horseDirection === HorseMovementDirections.left) {
                this.background.setMovingLeft();
            } else if (this.horseDirection === HorseMovementDirections.right) {
                this.background.setMovingRight();
            }

            if (this.isHorseMoving) {
                if (this.isHorseRunning) {
                    this.background.setRunning();
                } else {
                    this.background.setWalking();
                }
            } else {
                this.background.setMovingStop();
            }
        } else {
            this.background.setMovingStop();
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

    private setupEventListener () {
        let frameWidth = FRAME_WIDTH;
        let frameHeight = FRAME_HEIGHT;

        let currentFrame = 0;
		this.context.canvas.addEventListener('tick', (_event: Event) => {
            this.handleMovementSounds();
            this.handleMovingBackground();
            if (this.isHorseMoving) {
                // Pick a new frame
                currentFrame++;
            }

            let { numColumns, numRows, row } = this.getHorseSpriteSheetLocation();

            // Make the frames loop
            let maxFrame = numColumns * numRows - 1;
            if (currentFrame > maxFrame){
                currentFrame = 0;
            }

            // Update rows and columns in sprite sheet
            let column = currentFrame % numColumns;

            this.context.drawImage(
                this.image, column * frameWidth, row * frameHeight,
                frameWidth,
                frameHeight,
                (this.canvas.width / 2) - (FRAME_WIDTH/ 2),
                (this.canvas.height / 2) - (FRAME_HEIGHT/ 2),
                frameWidth,
                frameHeight,
            );
        });
    }
}
