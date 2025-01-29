import Background from "../background";
import Horse from "../horse";

const FRAME_RATE = 40;

class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private horse: Horse

    constructor () {
        this.canvas = document!.getElementById('main-canvas') as HTMLCanvasElement;
        this.context = this.canvas!.getContext('2d') as CanvasRenderingContext2D;

        this.background = new Background(this.canvas, this.context);
        this.horse = new Horse(this.canvas, this.context, this.background);

        this.initTicker();
    }

    private initTicker () {
        window.setInterval(() => {
            this.tick();
        }, 75);
        // TODO: Look into using this
        // window.requestAnimationFrame(() => {
		// 	this.tick();
		// 	// this.initTicker();
		// });
    }

    private tick () {
		const tick: CustomEvent = new CustomEvent('tick', {
			bubbles: true,
			cancelable: true,
			composed: false,
		});
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.canvas.dispatchEvent(tick);
    }
}

export const init = () => {
    new Game();
};
