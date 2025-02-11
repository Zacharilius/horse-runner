import Background from "../background";
import Horse from "../horse";
import Obstacle from "../obstacle";

const FRAME_RATE = 60;

class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas!.getContext('2d') as CanvasRenderingContext2D;

        // Loads all the images and sounds
        const background = new Background(this.canvas);
        const obstacle = new Obstacle(this.canvas, background);
        new Horse(this.canvas, background, obstacle);

        this.initTicker();
    }

    private initTicker (lastFrame = performance.now()) {
        window.requestAnimationFrame(() => {
			const newLastFrame = this.tick(lastFrame);
			this.initTicker(newLastFrame);
		});
    }

    private tick (lastFrame: DOMHighResTimeStamp): DOMHighResTimeStamp {
        const frameInterval = 1000 / FRAME_RATE;
        const now = performance.now();
        const elapsed = now - lastFrame;
        if (elapsed > frameInterval) {
            const tick: CustomEvent = new CustomEvent('tick', {
                bubbles: true,
                cancelable: true,
                composed: false,
            });
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.dispatchEvent(tick);
            return now;
        }
        return lastFrame;
    }
}

export const init = (canvas: HTMLCanvasElement) => {
    new Game(canvas);
};
