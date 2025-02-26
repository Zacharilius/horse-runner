import { init } from './index';

jest.mock('../background', () => {
    return {
        default: {
            create: jest.fn().mockReturnValue({
                getDirection: jest.fn().mockReturnValue(1),
                getSpeed: jest.fn().mockReturnValue(10),
            })
        }
    };
});

jest.mock('../horse', () => {
    return {
        default:  {
            create: jest.fn()
        }
    };
});

test('Game - should init', async () => {
    const canvas = document.createElement('canvas');
    await init(canvas);
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

test('Game - should handle requestAnimationFrame and not run when time between is > framerate', async () => {
    const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame');
    jest.spyOn(performance, 'now').mockImplementationOnce(() => 0).mockImplementationOnce(() => 17)

    const {
        canvas,
        context
    } = await testGame(requestAnimationFrameSpy);

    expect(context?.clearRect).toHaveBeenCalledTimes(1);
    expect(canvas.dispatchEvent).toHaveBeenCalledTimes(1);
});

const testGame = async (requestAnimationFrameSpy: jest.SpyInstance) => {
    const canvas = document.createElement('canvas');
    jest.spyOn(canvas, 'dispatchEvent');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    await init(canvas);
    const callback = requestAnimationFrameSpy.mock.calls[0][0];
    callback(1);

    return {
        canvas,
        context
    }
}
