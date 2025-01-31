import forest from './forest.jpg';
import ImageTag from '../image'

enum Direction {
    Left = -1,
    Right = 1,
};

const SPEED = 30;

export default class Background {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private image: HTMLImageElement;

    private speed: number = 0;
    private direction: Direction = Direction.Left;

    constructor (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
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
		this.context.canvas.addEventListener('tick', (event: Event) => {
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
                this.canvas.width,
                this.canvas.height,
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
                this.canvas.width,
                this.canvas.height,
            );
            // Draw image to right
            this.context.drawImage(
                this.image,
                x - this.image.width,
                0,
                this.image.width,
                this.image.height,
                0,
                0,
                this.canvas.width,
                this.canvas.height,
            );
        });
    }
}
