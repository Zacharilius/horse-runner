import Background from '../background';
import Horse from '../horse';
import { Game, init } from './index';

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

jest.mock('../modal');

test('Game - should init', async () => {
    const canvas = document.createElement('canvas');
    await init(canvas);
});

test('Game - startGame should start both background and hrose', async () => {
    const canvas = document.createElement('canvas');
    const startBackground = jest.fn();
    const mockBackground = {  start: startBackground } as unknown as Background;
    const startHorse = jest.fn();
    const mockHorse = {  start: startHorse } as unknown as Horse;
    const game = new Game(canvas, mockBackground, mockHorse);
    game.startGame();
    expect(startBackground).toHaveBeenCalled();
    expect(startHorse).toHaveBeenCalled();
});

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
    const game = await init(canvas);
    const callback = requestAnimationFrameSpy.mock.calls[0][0];
    callback(1);

    return {
        canvas,
        context,
        game
    }
}
