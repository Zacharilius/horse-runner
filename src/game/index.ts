import Background from "../background";
import Horse from "../horse";
import Modal from "../modal";
import Obstacle from "../obstacle";

const FRAME_RATE = 60;

const startGameModalHtml = `
    <div class="column-container">
        <div class="column">
            <table>
                <tr>
                    <td>&uarr;</td>
                    <td>up</td>
                <tr>
                <tr>
                    <td>&darr;</td>
                    <td>down</td>
                <tr>
                <tr>
                    <td class="center">s</td>
                    <td>change horses</td>
                <tr>
            </table>
        </div>
        <div class="column">
            <table>
                <tr>
                    <td class="center">r</td>
                    <td>run</td>
                <tr>
                <tr>
                    <td class="center">n</td>
                    <td>neigh</td>
                <tr>
                <tr>
                    <td class="center">" "</td>
                    <td>jump</td>
                <tr>
                <tr>
                    <td class="center">"p"</td>
                    <td>pause</td>
                <tr>
            </table>
        </div>
    </div>
`;

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private background: Background;
    private horse: Horse;
    private isPaused = false;

    // Constructor
    static async create (
        canvas: HTMLCanvasElement,
    ): Promise<Game> {
        const background = await Background.create(canvas)
        const obstacle = new Obstacle(canvas, background);
        const horse = await Horse.create(canvas, background, obstacle);
        const game = new Game(canvas, background, horse);

        const modal = new Modal('Keys', startGameModalHtml, () => game.startGame());
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
        this.setupKeyBindings();
    }

    private initTicker (lastFrame = performance.now()) {
        window.requestAnimationFrame(() => {
			const newLastFrame = this.tick(lastFrame);
			this.initTicker(newLastFrame);
		});
    }

    private setupKeyBindings () {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                // If the horse is dying, do not allow to pause because
                // a modal is already displayed.
                // TODO: Find a better way to determine global state.
                if (this.horse.isHorseAlive()) {
                    this.isPaused = !this.isPaused
                    const modal = new Modal('Paused', 'Press "p" to play', () => this.isPaused = !this.isPaused);
                    if (this.isPaused) {
                        modal.show();
                        this.horse.pause();
                    } else {
                        modal.hide();
                    }
                }
            }
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
            // Do not fire events when the game is paused.
            if (!this.isPaused) {
                this.canvas.dispatchEvent(tick);
            }
            return now;
        }
        return lastFrame;
    }
}

export const init = async (canvas: HTMLCanvasElement): Promise<Game> => {
    return await Game.create(canvas);
};
