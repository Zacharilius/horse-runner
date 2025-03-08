import './index.css';


const getModalHtml = (title: string, bodyHtml: string): string => {
    return `
        <div class="modal-content">
            <h2>${title}</h2>
            <div class="modal-body">
                ${bodyHtml}
            </div>
            <button class="close-modal-button">X</button>
        </div>
    `;
}

export default class Modal {
    private element: HTMLElement;

    constructor (title: string, bodyHtml: string, modalCloseCallback: () => void) {
        this.element = document.querySelector('#modal') as HTMLElement;
        this.element.innerHTML = getModalHtml(title, bodyHtml);
        const onClickCloseModalButton = () => {
            this.hide();
            modalCloseCallback();
            this.element.querySelector('.close-modal-button')?.removeEventListener('click', onClickCloseModalButton);
            window.removeEventListener('keydown', onKeydownCloseModalButton);
        }
        const onKeydownCloseModalButton = (event: KeyboardEvent) => {
            if (['Escape'].indexOf(event.key) >= 0) {
                this.hide();
                modalCloseCallback();
                this.element.querySelector('.close-modal-button')?.removeEventListener('click', onClickCloseModalButton);
                window.removeEventListener('keydown', onKeydownCloseModalButton);
            }
        }

        this.element.querySelector('.close-modal-button')?.addEventListener('click', onClickCloseModalButton);
        window.addEventListener('keydown', onKeydownCloseModalButton);
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
