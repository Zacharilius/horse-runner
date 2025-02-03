import forest from './1.png';
import ImageTag from '../image'

enum Direction {
    Left = -1,
    Right = 1,
};

const SPEED = 30;

const SCALE = 0.2;

export default class Background {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private image: HTMLImageElement;

    private speed: number = 0;
    private direction: Direction = Direction.Left;

    constructor (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
        // TODO: Handle async nature of loading image.
        this.image = ImageTag.getImage(forest);
        this.setupEventListener();   
    }

    public setMovingLeft () {
        // this.speed = SPEED;
        this.direction = Direction.Left;
    }

    public setMovingRight () {
        // this.speed = SPEED;
        this.direction = Direction.Right;
    }

    public setMovingStop () {
        this.speed = 0;
    }

    public setWalking () {
        this.speed = 10;
    }

    public setRunning () {
        this.speed = 60;
    }

    private setupEventListener () {
        let x = 0;
        this.context.imageSmoothingEnabled = false;
		this.context.canvas.addEventListener('tick', (event: Event) => {
            console.log('this.image.width', this.image.width);
            console.log('this.image.height', this.image.height);
            x += (this.direction * this.speed);
            x %= this.image.width;
            // Draw image to left
            this.context.drawImage(
                this.image,
                x + this.image.width,
                0,
                this.image.width,
                this.image.height,
                0,
                0,
                this.image.width * SCALE,
                this.image.height * SCALE,
            );
            // Draw center image
            this.context.drawImage(
                this.image,
                x,
                0,
                this.image.width,
                this.image.height,
                0,
                0,
                this.image.width * SCALE,
                this.image.height * SCALE,
            );
            // // Draw image to right
            this.context.drawImage(
                this.image,
                x - this.image.width,
                0,
                this.image.width,
                this.image.height,
                0,
                0,
                this.image.width * SCALE,
                this.image.height * SCALE,
            );
        });
    }
}
