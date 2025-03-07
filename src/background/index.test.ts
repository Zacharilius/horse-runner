import Background, { RUNNING_SPEED, WALKING_SPEED } from './index';
import ImageTag from '../image'

jest.mock('../image');

const createBackground = async (canvas: HTMLCanvasElement = document.createElement('canvas')): Promise<Background> => {
    return Background.create(canvas);
}

beforeAll(() => {
    jest.spyOn(ImageTag, 'getImage').mockReturnValue(Promise.resolve(new Image(0)))
});

test('Background - start should throw error if', async () => {
    expect(() => new Background(document.createElement('canvas'))).toThrow();
});

test('Background - start should set speed to walking and direction to left', async () => {
    const background = await createBackground();
    background.start();
    expect(background.getSpeed()).toBe(WALKING_SPEED);
    expect(background.getDirection()).toBe(-1);
});

test('Background - startRunning and stopRunning', async () => {
    const background = await createBackground();
    background.start();
    expect(background.getSpeed()).toBe(WALKING_SPEED);
    background.startRunning();
    expect(background.getSpeed()).toBe(RUNNING_SPEED);
    background.stopRunning();
    expect(background.getSpeed()).toBe(WALKING_SPEED);
    expect(background.getDirection()).toBe(-1);
});

test('Background - stop', async () => {
    const background = await createBackground();
    background.start();
    background.stop();
    expect(background.getSpeed()).toBe(0);
});

test('Background - tick event listener', async () => {
    const canvas = document.createElement('canvas') as jest.Mocked<HTMLCanvasElement>;
    jest.spyOn(canvas, 'addEventListener');
    createBackground(canvas);
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const eventCallback = canvas.addEventListener.mock.calls[0][1] as EventListener;
    eventCallback(new Event('tick'));

    // Color background skyblue;
    expect(context.fillStyle).toBe('#87ceeb');
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);

    // Called 9 times because we have 3 images and we draw them 3 times.
    expect(context.drawImage).toHaveBeenCalledTimes(9);
});
