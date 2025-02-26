import { bootstrap } from './bootstrap';
import { init } from './game';

jest.mock('./game');

test('Horse - should throw error when there is no root element.', async () => {
    expect(bootstrap()).rejects.toThrow(Error);
});

test('Horse - should ', async () => {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = '<div id="root"></div>';
    }
    await bootstrap();

    expect(init).toHaveBeenCalledTimes(1);
});
