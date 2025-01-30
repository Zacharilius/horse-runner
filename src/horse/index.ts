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

import ImageTag from '../image'
import Background from '../background';
import Sound from '../sound';


const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 48;

// Horse sprite
const numColumns = 8;
const numRows = 1;

enum HorseRunDirections {
    left = 8,
    right = 9,
    down = 10,
    up = 11,
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
    private horseDirection: HorseRunDirections = HorseRunDirections.left
    private isHorseRunning: boolean = false;
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
        this.image = horseImages[this.imageIndex];
        this.runningSound = Sound.createAutoPlayLoop(horseGalloping);
        this.neighingSound = new Sound(horseNeighing);
        this.setupKeyPress();
        this.setupEventListener();   
    }

    private setupKeyPress () {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                this.isHorseRunning = true;
                this.horseDirection = HorseRunDirections.up;
            } else if (event.key === 'ArrowDown') {
                this.isHorseRunning = true;
                this.horseDirection = HorseRunDirections.down;
            } else if (event.key === 'ArrowLeft') {
                this.background.setMoving();
                this.isHorseRunning = true;
                this.horseDirection = HorseRunDirections.left;
                this.background.setMovingLeft();
            } else if (event.key === 'ArrowRight') {
                this.background.setMoving();
                this.isHorseRunning = true;
                this. horseDirection = HorseRunDirections.right;
                this.background.setMovingRight();
            } else if (event.key === ' ') {
                const imageIndex = (this.imageIndex + 1) % horseImages.length
                this.setHorse(imageIndex)
            } else if (event.key === 'n') {
                this.neighingSound.play();
            }
        });

        const KEY_UPS_TO_STOP_MOVEMENT = new Set<string>([
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
        ]);

        window.addEventListener('keyup', (event) => {
            if (KEY_UPS_TO_STOP_MOVEMENT.has(event.key)) {
                this.background.setMovingStop();
                this.isHorseRunning = false;
            }
        });
    }

    private setHorse (imageIndex: number) {
        this.imageIndex = imageIndex;
        this.image = horseImages[this.imageIndex]
    }

    private setupEventListener () {
        let frameWidth = FRAME_WIDTH;
        let frameHeight = FRAME_HEIGHT;

        let currentFrame = 0;
		this.context.canvas.addEventListener("tick", (_event: Event) => {
            if (this.isHorseRunning) {
                // Pick a new frame
                currentFrame++;
                this.runningSound.play();
            } else {
                this.runningSound.stop();
            }

            // Make the frames loop
            let maxFrame = numColumns * numRows - 1;
            if (currentFrame > maxFrame){
                currentFrame = 0;
            }
            // Update rows and columns
            let column = currentFrame % numColumns;
            let row = this.horseDirection; //8; //Math.floor(currentFrame / numColumns);

            this.context.drawImage(
                this.image, column * frameWidth, row * frameHeight,
                frameWidth,
                frameHeight,
                (this.canvas.width / 2) - (FRAME_WIDTH/ 2),
                (this.canvas.height / 2) - (FRAME_HEIGHT/ 2),
                frameWidth,
                frameHeight
            );
        });
    }
}
