import { init } from './index';

jest.mock('../background', () => {
    return {
        default: jest.fn()
    };
});

jest.mock('../horse', () => {
    return {
        default: jest.fn()
    };
});

const context = {
    clearRect: jest.fn()
} as unknown as CanvasRenderingContext2D;

const canvas = {
    getContext: jest.fn().mockReturnValue(context),
    width: 100,
    height: 100,
    dispatchEvent: jest.fn(),
} as unknown as HTMLCanvasElement;


test('Game', () => {
    document.body.innerHTML = '<canvas id="main-canvas"></canvas>';
    init(canvas as unknown as HTMLCanvasElement);
});