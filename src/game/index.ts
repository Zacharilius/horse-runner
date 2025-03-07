import Background from "../background";
import Horse from "../horse";
import Modal from "../modal";
import Obstacle from "../obstacle";

const FRAME_RATE = 60;

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private horse: Horse;

    // Constructor
    static async create (
        canvas: HTMLCanvasElement,
    ): Promise<Game> {
        const background = await Background.create(canvas)
        const obstacle = new Obstacle(canvas, background);
        const horse = await Horse.create(canvas, background, obstacle);
        const game = new Game(canvas, background, horse);

        const modal = new Modal(() => game.startGame());
        modal.show();

        return game
    }

    // Do not construct. use static create() constructor to ensure assets are fully loaded.
    constructor (canvas: HTMLCanvasElement, background: Background, horse: Horse) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.background = background;
        this.horse = horse;
        this.initTicker();
    }

    public startGame () {
        this.background.start();
        this.horse.start();
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

export const init = async (canvas: HTMLCanvasElement): Promise<Game> => {
    return await Game.create(canvas);
};
