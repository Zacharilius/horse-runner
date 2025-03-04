import './index.css';

export default class Modal {
    private element: HTMLElement;

    constructor () {
        this.element = document.querySelector('#modal') as HTMLElement;
        this.element.querySelector('.close-modal-button')?.addEventListener('click', () => {
            this.hide();
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.hide();
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
