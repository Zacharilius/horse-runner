import Image from './index';

const MOCK_IMAGE_FILE_NAME = 'image.png';

test('should create image correctly', () => {
    const image = Image.getImage(MOCK_IMAGE_FILE_NAME);
    expect(image.src).toBe(`http://localhost/${MOCK_IMAGE_FILE_NAME}`);
    expect(image instanceof HTMLImageElement).toBe(true);
});
