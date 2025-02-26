import {
    BackgroundImageOnBottom,
    BackgroundImageOnBottomWithOffset
} from './index';

const MOCK_Y_OFFSET = 100;

const mockCanvas = {
    height: 100,
} as HTMLCanvasElement;

const mockScale = 1;

const mockImage = new Image();
mockImage.height = 100;

test('BackgroundImageOnBottom - should return Image', () => {
    const backgroundImage = new BackgroundImageOnBottom(mockImage);
    expect(backgroundImage.getElement() instanceof HTMLImageElement).toBe(true);
});

test('BackgroundImageOnBottomWithOffset - should return Image', () => {
    const backgroundImage = new BackgroundImageOnBottomWithOffset(mockImage, MOCK_Y_OFFSET);
    expect(backgroundImage.getElement() instanceof HTMLImageElement).toBe(true);
});

test('BackgroundImageOnBottom - should calculate correctly', () => {
    const backgroundImage = new BackgroundImageOnBottom(mockImage);
    expect(backgroundImage.getCanvasYOffset(mockCanvas, mockScale)).toBe(0);
});

test('BackgroundImageOnBottomWithOffset - should calculate correctly', () => {
    const backgroundImage = new BackgroundImageOnBottomWithOffset(mockImage, MOCK_Y_OFFSET);
    expect(backgroundImage.getCanvasYOffset(mockCanvas, mockScale)).toBe(-100);
});
