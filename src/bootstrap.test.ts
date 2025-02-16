import { bootstrap } from './bootstrap';
import { init } from './game';

jest.mock('./game');

test('Horse - should throw error when there is no root element.', () => {
    expect(bootstrap).toThrow(Error);
});

test('Horse - should ', () => {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = '<div id="root"></div>';
    }
    bootstrap();

    expect(init).toHaveBeenCalledTimes(1);
});
