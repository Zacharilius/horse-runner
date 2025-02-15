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
