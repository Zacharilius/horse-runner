
import {
    BackgroundImage,
    BackgroundImageOnBottom,
    BackgroundImageOnBottomWithOffset
} from './images';
import hills from './images/hills.png';
import trail from './images/trail.png';
import trees from './images/trees.png';

enum Direction {
    Left = -1,
    Right = 1,
};

export default class Background {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private images: BackgroundImage[];

    private speed: number = 0;
    private direction: Direction = Direction.Left;

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.images = [
            new BackgroundImageOnBottom(trail),
            new BackgroundImageOnBottomWithOffset(hills, 45),
            new BackgroundImageOnBottomWithOffset(trees, 55),
        ];
        this.setupEventListener();   
    }

    public startMovingLeft (speed: number) {
        this.direction = Direction.Left;
        this.speed = speed;
    }

    public startMovingRight (speed: number) {
        this.direction = Direction.Right;
        this.speed = speed;
    }

    public setMovingStop () {
        this.speed = 0;
    }

    private setupEventListener () {
        let x = 0;
        this.context.imageSmoothingEnabled = false;
        this.canvas.addEventListener('tick', () => {
            // Draw sky
            this.context.fillStyle = 'skyblue';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // When drawing left/right images we need to position the image a little
            // offset to prevent a line between images.
            const BUFFFER_PIXELS = 10;

            x += (this.direction * this.speed);
            // All background images are tne same width.
            // TODO: Find a better way to get the element in case images[0] is empty.
            x %= this.images?.[0].getElement().width;
            this.images.forEach((image) => {
                const imageElement = image.getElement();
                const x_offsets = [
                    x,
                    x - imageElement.width + BUFFFER_PIXELS,
                    x + imageElement.width - BUFFFER_PIXELS,
                ];
                x_offsets.forEach((x) => {
                    const scale = this.canvas.width / imageElement.width;
                    this.context.drawImage(
                        imageElement,
                        x,
                        0,
                        imageElement.width,
                        imageElement.height,
                        0,
                        image.getCanvasYOffset(this.canvas, scale),
                        imageElement.width * scale,
                        imageElement.height * scale,
                    );
                });
            });
        });
    }

    //==========================================================================
    // For testing purposes
    public getSpeed () {
        return this.speed;
    }
    public getDirection () {
        return this.direction;
    }
}
