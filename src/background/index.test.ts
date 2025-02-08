import Background from './index';

const mockCanvas = {
    addEventListener: jest.fn(),
    height: 100,
    width: 100,
};

const mockContext = {
    fillRect: jest.fn(),
    drawImage: jest.fn(),
    fillStyle: '',
};

const mockSpeed = 10;;

const createBackground = (): Background => {
    return new Background(
        mockCanvas as unknown as HTMLCanvasElement,
        mockContext as unknown as CanvasRenderingContext2D
    );
}

test('Background - setMovingStop should set speed to 0', () => {
    const background = createBackground();
    background.setMovingStop();
    expect(background.getSpeed()).toBe(0);
});

test('Background - startMovingLeft should set speed to 0 and direction to left', () => {
    const background = createBackground();
    background.startMovingLeft(mockSpeed);
    expect(background.getSpeed()).toBe(mockSpeed);
    expect(background.getDirection()).toBe(-1);
});

test('Background - startMovingRight should set speed to 0 and direction to left', () => {
    const background = createBackground();
    background.startMovingRight(mockSpeed);
    expect(background.getSpeed()).toBe(mockSpeed);
    expect(background.getDirection()).toBe(1);
});

test('Background - tick event listener', () => {
    createBackground();
    const eventCallback = mockCanvas.addEventListener.mock.calls[0][1];
    eventCallback();

    // Color background blue;
    expect(mockContext.fillStyle).toBe('skyblue');
    expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height);

    // Called 9 times because we have 3 images and we draw them 3 times.
    expect(mockContext.drawImage).toHaveBeenCalledTimes(9);
});
