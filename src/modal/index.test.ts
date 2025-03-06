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

let mockStartGame: () => void;

beforeEach(() => {
    mockStartGame = jest.fn();
});

test('Modal - should init', async () => {
    const button = attachModalCloseButton();
    const modal = new Modal(mockStartGame);
    expect(modal).toBeInstanceOf(Modal);

    expect(button.addEventListener).toHaveBeenCalledTimes(1);
    expect(mockStartGame).toHaveBeenCalledTimes(0);
});

test('Modal - should show', async () => {
    attachModalCloseButton();
    const modal = new Modal(mockStartGame);
    expect(modal.isVisible()).toBe(false);
    modal.show();
    expect(modal.isVisible()).toBe(true);
});

test('Modal - should hide when hide() is called', async () => {
    attachModalCloseButton();
    const modal = new Modal(mockStartGame);
    modal.hide();
    expect(modal.isVisible()).toBe(false);
});

test('Modal - should hide when "Escape" is pressed', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    attachModalCloseButton();
    const modal = new Modal(mockStartGame);
    const keyDownEventHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    keyDownEventHandler(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(mockStartGame).toHaveBeenCalled();
    expect(modal.isVisible()).toBe(false);
});

test('Modal - should hide when x clicked', async () => {
    const button = attachModalCloseButton();
    const spy = jest.spyOn(button, 'addEventListener');
    const modal = new Modal(mockStartGame);
    const clickCallback = spy.mock.calls[0][1] as EventListener;
    modal.show();
    expect(modal.isVisible()).toBe(true);
    clickCallback(new Event('click'));
    expect(mockStartGame).toHaveBeenCalled();
    expect(modal.isVisible()).toBe(false);
});
