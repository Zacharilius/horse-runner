import blackGray from './images/blackBodyGrayManeHorse.png';
import blackWhite from './images/blackBodyWhiteManeHorse.png';
import brownBlonde from './images/brownBodyBlondeManeHorse.png'
import brownTan from './images/brownBodyTanManeHorse.png';
import grayWhite from './images/grayBodyWhiteManeHorse.png';
import redBlack from './images/redBodyBlackManeHorse.png';
import redBrown from './images/redBodyBrownManeHorse.png';
import whiteWhite from './images/whiteBodyWhiteManeHorse.png';

import { getImage } from '../image'
import Background from '../background';


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
    blackGray,
    blackWhite,
    brownBlonde,
    brownTan,
    grayWhite,
    redBlack,
    redBrown,
    whiteWhite,
];

export default class Horse {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private image: CanvasImageSource;
    private imageIndex: number = 0;
    private horseDirection: HorseRunDirections = HorseRunDirections.left
    private isHorseRunning: boolean = false;

    constructor (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        background: Background,
    ) {
        this.canvas = canvas;
        this.context = context;
        this.background = background;
        this.image = getImage(horseImages[this.imageIndex]);
        this.setupKeyPress();
        this.setupEventListener();   
    }

    private setupKeyPress () {
        window.addEventListener('keydown', (event) => {
            console.log('keydown');
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
                this.imageIndex = (this.imageIndex + 1) % horseImages.length
                this.setHorse(horseImages[this.imageIndex])
            }
        });

        window.addEventListener('keyup', (event) => {
            this.background.setMovingStop();
            this.isHorseRunning = false;
        });
    }

    private setHorse (imageSrc: string) {
        this.image = getImage(imageSrc);
    }

    private setupEventListener () {
        let frameWidth = FRAME_WIDTH; //img.width / numColumns;;
        let frameHeight = FRAME_HEIGHT; //img.height / numRows;;

        let currentFrame = 0;
		this.context.canvas.addEventListener("tick", (event: Event) => {
            if (this.isHorseRunning) {
                // Pick a new frame
                currentFrame++;
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
