import { Preloader } from './Preloader';
import { HorseSprites } from '../gameObjects/horseSprites';

describe('Preloader Scene', () => {
    let preloaderScene: Preloader;
    let mockScene: jest.Mocked<Phaser.Scene>;

    beforeEach(() => {
        mockScene = {
            add: {
                image: jest.fn(),
                rectangle: jest.fn(() => ({
                    setStrokeStyle: jest.fn(),
                })),
            },
            load: {
                setPath: jest.fn(),
                image: jest.fn(),
                spritesheet: jest.fn(),
                audio: jest.fn(),
                on: jest.fn(),
            },
            scene: {
                start: jest.fn(),
            },
        } as unknown as jest.Mocked<Phaser.Scene>;

        preloaderScene = new Preloader();
        Object.assign(preloaderScene, mockScene); // Mock Phaser's Scene methods
    });

    it('should initialize the background and progress bar in init()', () => {
        preloaderScene.init();

        expect(mockScene.add.rectangle).toHaveBeenCalledWith(512, 384, 468, 32);
        expect(mockScene.add.rectangle).toHaveBeenCalledWith(512 - 230, 384, 4, 28, 0xffffff);
        expect(mockScene.load.on).toHaveBeenCalledWith('progress', expect.any(Function));

        // Simulate progress event
        const progressCallback = (mockScene.load.on as jest.Mock).mock.calls[0][1];
        const mockBar = { width: 4 };
        progressCallback.call({ bar: mockBar }, 0.5); // Simulate 50% progress
    });

    it('should preload all assets in preload()', () => {
        preloaderScene.preload();

        expect(mockScene.load.setPath).toHaveBeenCalledWith('assets');

        // Backgrounds
        expect(mockScene.load.image).toHaveBeenCalledWith('hillsBackground', 'background/hills.png');
        expect(mockScene.load.image).toHaveBeenCalledWith('trailBackground', 'background/trail.png');
        expect(mockScene.load.image).toHaveBeenCalledWith('treesBackground', 'background/trees.png');

        // Horse sprites
        Object.keys(HorseSprites).forEach((key) => {
            const horseSprite = HorseSprites[key as keyof typeof HorseSprites];
            expect(mockScene.load.spritesheet).toHaveBeenCalledWith(
                horseSprite,
                `horses/images/${horseSprite}.png`,
                { frameWidth: 64, frameHeight: 48 }
            );
        });

        // Sounds
        expect(mockScene.load.audio).toHaveBeenCalledWith('galloping', 'horses/sounds/horse-galloping.wav');
        expect(mockScene.load.audio).toHaveBeenCalledWith('neigh', 'horses/sounds/horse-neigh.mp3');
        expect(mockScene.load.audio).toHaveBeenCalledWith('scream', 'horses/sounds/horse-scream.mp3');
        expect(mockScene.load.audio).toHaveBeenCalledWith('walking', 'horses/sounds/horse-walking.mp3');
    });

    it('should transition to the MainMenu scene in create()', () => {
        preloaderScene.create();

        expect(mockScene.scene.start).toHaveBeenCalledWith('MainMenu');
    });
});