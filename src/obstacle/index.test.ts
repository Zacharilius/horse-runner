import Obstacle from '.';
import Background from '../background';

jest.mock('../background', () => {
    return {
        default: jest.fn().mockReturnValue({
            getDirection: jest.fn().mockReturnValue(-1),
            getSpeed: jest.fn().mockReturnValue(15),
        }),
    };
});

const createObstacle = (): Obstacle => {
    const canvas = document.createElement('canvas') as jest.Mocked<HTMLCanvasElement>;
    // Set width to cause obstacle to wrap around.
    canvas.width = 5;
    const background = new Background(canvas);
    return new Obstacle(canvas, background);
}

test('Obstacle - should init', async () => {
    const obstacle = createObstacle();
    expect(obstacle).toBeInstanceOf(Obstacle);
    expect(obstacle.getCount()).toBe(0);
});

test('Obstacle - getBoundingBox should return correct values', async () => {
    const obstacle = createObstacle();
    expect(obstacle.getBoundingBox()).toEqual(expect.objectContaining({
        top: expect.any(Number),
        left: expect.any(Number),
        width: 5,
        height: 10,
    }));
});

test('Obstacle - should reset', async () => {
    const obstacle = createObstacle();
    obstacle.reset();
    expect(obstacle.getCount()).toBe(0);
    expect(obstacle.getBoundingBox()).toEqual(expect.objectContaining({
        top: expect.any(Number),
        left: 1,
        width: 5,
        height: 10,
    }));
});

test('Obstacle - should create new obstacle after obstacle goes off screen', async () => {
    const obstacle = createObstacle();
    expect(obstacle.getBoundingBox().left).toBe(1);
    expect(obstacle.getBoundingBox().left).toBe(2);
    expect(obstacle.getBoundingBox().left).toBe(3);
    expect(obstacle.getBoundingBox().left).toBe(4);
    expect(obstacle.getBoundingBox().left).toBe(5);

    // Wraps around to be 0 again and increments count.
    expect(obstacle.getBoundingBox().left).toBe(1);
    expect(obstacle.getCount()).toBe(1);
});
