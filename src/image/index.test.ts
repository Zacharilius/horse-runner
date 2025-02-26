import ImageTag from './index';

const MOCK_IMAGE_FILE_NAME = 'image.png';




test('should create image correctly', async () => {
    const mockImageTag = new Image();
    const mockImage = jest.spyOn(window, 'Image').mockImplementation(() => mockImageTag);
    const imagePromise = ImageTag.getImage(MOCK_IMAGE_FILE_NAME);
    mockImageTag.dispatchEvent(new Event('load'));
    const image = await imagePromise;

    expect(image.src).toBe(`http://localhost/${MOCK_IMAGE_FILE_NAME}`);

    mockImage.mockRestore();
});
