import trail from './images/1.png';
import ImageTag from '../image'

enum Direction {
    Left = -1,
    Right = 1,
};

const WALKING_SPEED = 10;
const RUNNING_SPEED = 60;

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
        this.image = ImageTag.getImage(trail);
        this.setupEventListener();   
    }

    public setMovingLeft () {
        this.direction = Direction.Left;
    }

    public setMovingRight () {
        this.direction = Direction.Right;
    }

    public setMovingStop () {
        this.speed = 0;
    }

    public setWalking () {
        this.speed = WALKING_SPEED;
    }

    public setRunning () {
        this.speed = RUNNING_SPEED;
    }

    private setupEventListener () {
        let x = 0;
        this.context.imageSmoothingEnabled = false;
		this.context.canvas.addEventListener('tick', (event: Event) => {
            x += (this.direction * this.speed);
            x %= this.image.width;

            // Draw sky
            this.context.fillStyle = 'skyblue';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
