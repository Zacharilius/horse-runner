import Background from './index';
import ImageTag from '../image'

jest.mock('../image');

const mockSpeed = 10;;

const createBackground = async (canvas: HTMLCanvasElement = document.createElement('canvas')): Promise<Background> => {
    return Background.create(canvas);
}

beforeAll(() => {
    jest.spyOn(ImageTag, 'getImage').mockReturnValue(Promise.resolve(new Image(0)))
});

test('Background - setMovingStop should set speed to 0', async () => {
    const background = await createBackground();
    background.setMovingStop();
    expect(background.getSpeed()).toBe(0);
});

test('Background - startMovingLeft should set speed to 0 and direction to left', async () => {
    const background = await createBackground();
    background.startMovingLeft(mockSpeed);
    expect(background.getSpeed()).toBe(mockSpeed);
    expect(background.getDirection()).toBe(-1);
});

test('Background - startMovingRight should set speed to 0 and direction to left', async () => {
    const background = await createBackground();
    background.startMovingRight(mockSpeed);
    expect(background.getSpeed()).toBe(mockSpeed);
    expect(background.getDirection()).toBe(1);
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
