import './index.css';

export default class Modal {
    private element: HTMLElement;

    constructor (startGame: () => void) {
        this.element = document.querySelector('#modal') as HTMLElement;
        this.element.querySelector('.close-modal-button')?.addEventListener('click', () => {
            this.hide();
            startGame();
        });

        // Works around a bug where calling startGame causes background to slightly move after horse dying.
        let hasStartedGame = false;
        window.addEventListener('keydown', (event) => {
            if (['Escape'].indexOf(event.key) >= 0) {
                this.hide();
                if (!hasStartedGame) {
                    startGame();
                    hasStartedGame = true;
                }
            }
        });
    }

    public show (): Modal {
        this.element.classList.remove('hidden');
        return this;
    }

    public hide (): Modal {
        this.element.classList.add('hidden');
        return this;
    }

    public isVisible (): boolean {
        return !this.element.classList.contains('hidden');
    }
}
