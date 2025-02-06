import ImageTag from '../image'

import hills from './images/hills.png';
import trail from './images/trail.png';
import trees from './images/trees.png';

enum Direction {
    Left = -1,
    Right = 1,
};

const WALKING_SPEED = 10;
const RUNNING_SPEED = 60;

// TODO: Move this to a separate file.
abstract class BackgroundImage {
    protected image: HTMLImageElement;

    constructor (imagePath: string) {
        this.image = ImageTag.getImage(imagePath);
    }

    public getElement (): HTMLImageElement {
        return this.image;
    }

    abstract getCanvasXOffset (canvas: HTMLCanvasElement, scale: number): number;
}

class BackgroundImageOnBottom extends BackgroundImage{
    constructor (imagePath: string) {
        super(imagePath);
    }
    public getCanvasXOffset (canvas: HTMLCanvasElement, scale: number) {
        return canvas.height - (this.image.height * scale)
    }
}

class BackgroundImageOnBottomWithOffset extends BackgroundImageOnBottom{
    constructor (imagePath: string, public yOffset: number) {
        super(imagePath);
    }
    public getCanvasXOffset (canvas: HTMLCanvasElement, scale: number) {
        return super.getCanvasXOffset(canvas, scale) - this.yOffset;
    }
}
export default class Background {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private images: BackgroundImage[];

    private speed: number = 0;
    private direction: Direction = Direction.Left;

    constructor (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
        this.images = [
            new BackgroundImageOnBottom(trail),
            new BackgroundImageOnBottomWithOffset(hills, 45),
            new BackgroundImageOnBottomWithOffset(trees, 55),
        ];
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
		this.context.canvas.addEventListener('tick', (_event: Event) => {
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
                        image.getCanvasXOffset(this.canvas, scale),
                        imageElement.width * scale,
                        imageElement.height * scale,
                    );
                });
            });
        });
    }
}
