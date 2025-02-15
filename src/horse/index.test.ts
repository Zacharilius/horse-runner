import Horse from './index';
import Background from '../background';
import Obstacle from '../obstacle';
import Sound from '../sound';

const SOUND_INDEX_FOR_NEIGHING = 2;

jest.mock('../background');
jest.mock('../bounding-box');
jest.mock('../obstacle');
jest.mock('../sound');

const getCanvas = (): HTMLCanvasElement => {
    return document.createElement('canvas');
}

const getHorse = (canvas: HTMLCanvasElement): Horse => {
    const background = new Background(canvas)
    const horse = new Horse(
        canvas,
        background,
        new Obstacle(canvas, background),
    );
    return horse;
}

beforeEach(() => {
    jest.clearAllMocks()
});

test('Horse - should initialize', () => {
    expect(getHorse(getCanvas())).toBeInstanceOf(Horse);
});

test('Horse - should play neighing sound when "n" key is pressed', () => {
    const canvas = getCanvas();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    getHorse(canvas);

    // Creates 3 sounds.
    expect(Sound).toHaveBeenCalledTimes(3);
    const mockNeighingSound = (Sound as jest.Mock).mock.instances[SOUND_INDEX_FOR_NEIGHING];

    const eventCallback = addEventListenerSpy.mock.calls[0][1] as EventListener;
    eventCallback(new KeyboardEvent('keydown', { key: 'n' }));

    expect(mockNeighingSound.play).toHaveBeenCalled();
});

test('Horse - should run when keys are pressed', () => {
    const canvas = getCanvas() as jest.Mocked<HTMLCanvasElement>;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    jest.spyOn(canvas, 'addEventListener');
    jest.spyOn(context, 'drawImage');

    getHorse(canvas);
    const eventCallback = canvas.addEventListener.mock.calls[0][1] as EventListener;
    eventCallback(new Event('tick'));

    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        0,
        0,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
});

test('Horse - should run when keys are pressed', () => {
    const canvas = getCanvas() as jest.Mocked<HTMLCanvasElement>;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    jest.spyOn(canvas, 'addEventListener');
    jest.spyOn(context, 'drawImage');

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    getHorse(canvas);
   
    const keyDownEventHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    // Turn Horse Right
    keyDownEventHandler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    // Start Horse Running
    keyDownEventHandler(new KeyboardEvent('keydown', { key: 'r' }));

    const tickEventCallback = canvas.addEventListener.mock.calls[0][1] as EventListener;
    // Move horse 3 times.
    tickEventCallback(new Event('tick'));
    tickEventCallback(new Event('tick'));
    tickEventCallback(new Event('tick'));

    expect(context.drawImage).toHaveBeenCalledTimes(3);
    expect(context.drawImage).toHaveBeenNthCalledWith(1,
        expect.any(HTMLImageElement),
        64,
        576,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
    expect(context.drawImage).toHaveBeenNthCalledWith(2,
        expect.any(HTMLImageElement),
        128,
        576,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
    expect(context.drawImage).toHaveBeenNthCalledWith(3,
        expect.any(HTMLImageElement),
        192,
        576,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
});
