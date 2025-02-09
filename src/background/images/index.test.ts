import {
    BackgroundImageOnBottom,
    BackgroundImageOnBottomWithOffset
} from './index';
import ImageTag from '../../image'

const MOCK_IMAGE_FILE_NAME = 'image.png';

const MOCK_Y_OFFSET = 100;

const mockCanvas = {
    height: 100,
} as HTMLCanvasElement;

const mockScale = 1;

const stubImageTagGetImage = () => {
    jest.spyOn(ImageTag, 'getImage').mockImplementation(() => {
        return {
            height: 100,
        } as HTMLImageElement;
    });
};

test('BackgroundImageOnBottom - should return Image', () => {
    const backgroundImage = new BackgroundImageOnBottom(MOCK_IMAGE_FILE_NAME);
    expect(backgroundImage.getElement() instanceof HTMLImageElement).toBe(true);
});

test('BackgroundImageOnBottomWithOffset - should return Image', () => {
    const backgroundImage = new BackgroundImageOnBottomWithOffset(MOCK_IMAGE_FILE_NAME, MOCK_Y_OFFSET);
    expect(backgroundImage.getElement() instanceof HTMLImageElement).toBe(true);
});

test('BackgroundImageOnBottom - should calculate correctly', () => {
    const backgroundImage = new BackgroundImageOnBottom(MOCK_IMAGE_FILE_NAME);
    stubImageTagGetImage();
    expect(backgroundImage.getCanvasYOffset(mockCanvas, mockScale)).toBe(100);
});

test('BackgroundImageOnBottomWithOffset - should calculate correctly', () => {
    const backgroundImage = new BackgroundImageOnBottomWithOffset(MOCK_IMAGE_FILE_NAME, MOCK_Y_OFFSET);
    stubImageTagGetImage();
    expect(backgroundImage.getCanvasYOffset(mockCanvas, mockScale)).toBe(-100);
});
