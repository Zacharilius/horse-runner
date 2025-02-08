import Horse from './index';
import Background from '../background';

jest.mock('../image', () => {
    return {
        default: {
            getImage: jest.fn().mockReturnValue('mock-image')
        }
    };
});

jest.mock('../background', () => {
    return {
        default: jest.fn()
    };
});

jest.mock('../sound', () => {
    return {
        default: jest.fn()
    };
});

test('Horse - should initialize', () => {
    const canvas = document.createElement('canvas');
    const horse = new Horse(canvas as unknown as HTMLCanvasElement, {} as unknown as Background);
    expect(horse).toBeInstanceOf(Horse);
});