import { init } from './index';

jest.mock('../background', () => {
    return {
        default: jest.fn()
    };
});

jest.mock('../horse', () => {
    return {
        default: jest.fn()
    };
});

test('Game - should init', () => {
    const canvas = document.createElement('canvas');
    init(canvas);
});

// TODO: Enable after fixing the test
// test('Game - should handle requestAnimationFrame and not run when time between is < framerate', () => {
//     const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame');
//     jest.spyOn(performance, 'now').mockImplementationOnce(() => 0).mockImplementationOnce(() => 16)
    

//     const {
//         canvas,
//         context
//     } = testGame(requestAnimationFrameSpy);

//     expect(context?.clearRect).toHaveBeenCalledTimes(0);
//     expect(canvas.dispatchEvent).toHaveBeenCalledTimes(0);
// });

test('Game - should handle requestAnimationFrame and not run when time between is > framerate', () => {
    const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame');
    jest.spyOn(performance, 'now').mockImplementationOnce(() => 0).mockImplementationOnce(() => 17)

    const {
        canvas,
        context
    } = testGame(requestAnimationFrameSpy);

    expect(context?.clearRect).toHaveBeenCalledTimes(1);
    expect(canvas.dispatchEvent).toHaveBeenCalledTimes(1);
});

const testGame = (requestAnimationFrameSpy: jest.SpyInstance) => {
    const canvas = document.createElement('canvas');
    jest.spyOn(canvas, 'dispatchEvent');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    init(canvas);
    const callback = requestAnimationFrameSpy.mock.calls[0][0];
    callback(1);

    return {
        canvas,
        context
    }
}
