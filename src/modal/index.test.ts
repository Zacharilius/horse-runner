import Modal from './index';

const attachModalCloseButton = () => {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = `
            <div class="modal-overlay hidden" id="modal">
                <button class="close-modal-button">X</button>
            </div>
        `;
    }

    const button = document.querySelector('.close-modal-button') as HTMLElement;
    jest.spyOn(button, 'addEventListener');

    return button
}

test('Modal - should init', async () => {
    const button = attachModalCloseButton();
    const modal = new Modal();
    expect(modal).toBeInstanceOf(Modal);

    expect(button.addEventListener).toHaveBeenCalledTimes(1);
});

test('Modal - should show', async () => {
    attachModalCloseButton();
    const modal = new Modal();
    expect(modal).toBeInstanceOf(Modal);
    expect(modal.isVisible()).toBe(false);
    modal.show();
    expect(modal.isVisible()).toBe(true);
});

test('Modal - should hide', async () => {
    attachModalCloseButton();
    const modal = new Modal();
    expect(modal).toBeInstanceOf(Modal);
    modal.hide();
    expect(modal.isVisible()).toBe(false);
});

test('Modal - should hide when x clicked', async () => {
    const button = attachModalCloseButton();
    const spy = jest.spyOn(button, 'addEventListener');
    const modal = new Modal();
    const clickCallback = spy.mock.calls[0][1] as EventListener;
    modal.show();
    expect(modal.isVisible()).toBe(true);
    clickCallback(new Event('click'));
    expect(modal.isVisible()).toBe(false);
});
