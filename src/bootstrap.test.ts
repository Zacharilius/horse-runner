import { bootstrap } from './bootstrap';
import { init } from './game';

jest.mock('./game');

test('bootstrap - should throw error when there is no root element.', async () => {
    expect(bootstrap()).rejects.toThrow(Error);
});

test('bootstrap - should ', async () => {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = '<div id="root"></div>';
    }
    await bootstrap();

    expect(init).toHaveBeenCalledTimes(1);
});
