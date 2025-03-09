import Background from "../background";
import { BoundingBox } from "../bounding-box";

export default class Obstacle {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private count = 0;
    private x = 0;
    private y: number;

    constructor (
        canvas: HTMLCanvasElement,
        background: Background
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.background = background;

        this.y = this.calculateNewY();

        this.setupEventListener();   
    }

    private setupEventListener () {
		this.canvas.addEventListener('tick', () => {
            this.context.fillStyle = 'orange';
            const boundingBox = this.getBoundingBox();
            this.context.fillRect(
                boundingBox.left,
                boundingBox.top,
                boundingBox.width,
                boundingBox.height,
            );
        });
    }

    private calculateNewY (): number {
        // Numbers observed to make obstact stay on the trail but still be fun.
        const UPPER_LIMIT = 125;
        const LOWER_LIMIT = 105;

        const y = LOWER_LIMIT + (UPPER_LIMIT - LOWER_LIMIT) * Math.random();
        return y;
    }

    public reset () {
        this.x = 0;
        this.y = this.calculateNewY();
        this.count = 0;
    }

    public getBoundingBox (): BoundingBox {
        this.x += Math.floor(-1 * ((this.background.getDirection() * this.background.getSpeed()) / 15));

        // causes obstacle to wrap around.
        if (this.x < 0) {
            this.x = this.canvas.width;
            this.y = this.calculateNewY();
            this.count += 1;
        } else if (this.x > this.canvas.width) {
            this.x %=  this.canvas.width;
            this.y = this.calculateNewY();
            this.count += 1;
        }
        return {
            left: this.x,
            top: this.y,
            width: 5,
            height: 10
        }
    }

    public getCount(): number {
        return this.count;
    }
}
