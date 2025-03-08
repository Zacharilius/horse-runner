import Modal from './index';

const attachModal = () => {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = `
            <div class="modal-overlay hidden" id="modal">
            </div>
        `;
    }
}

const initModal = (): Modal => {
    return new Modal('title', 'body', mockStartGame);
}

let mockStartGame: () => void;

beforeEach(() => {
    mockStartGame = jest.fn();
});

test('Modal - should init', async () => {
    attachModal();
    const modal = initModal();
    expect(modal).toBeInstanceOf(Modal);
    expect(mockStartGame).toHaveBeenCalledTimes(0);
});

test('Modal - should show', async () => {
    attachModal();
    const modal = initModal();
    expect(modal.isVisible()).toBe(false);
    modal.show();
    expect(modal.isVisible()).toBe(true);
});

test('Modal - should hide when hide() is called', async () => {
    attachModal();
    const modal = initModal();
    modal.hide();
    expect(modal.isVisible()).toBe(false);
});

test('Modal - should hide when "Escape" is pressed', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    attachModal();
    const modal = initModal();
    const keyDownEventHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    keyDownEventHandler(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(mockStartGame).toHaveBeenCalled();
    expect(modal.isVisible()).toBe(false);
});

test('Modal - should hide when x clicked', async () => {
    attachModal();
    const modal = initModal();
    modal.show();
    expect(modal.isVisible()).toBe(true);
    const button = document.querySelector('.close-modal-button') as HTMLElement;
    button.click();
    expect(mockStartGame).toHaveBeenCalled();
    expect(modal.isVisible()).toBe(false);
});
