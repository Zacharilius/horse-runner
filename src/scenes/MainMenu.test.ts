import { MainMenu } from './MainMenu';
import { Player } from '../gameObjects/Player';
import { getSelectedSprite, updateSelectedSprite } from '../state';
import { HorseSprites } from '../gameObjects/horseSprites';

jest.mock('../gameObjects/Player');
jest.mock('../state');

describe('MainMenu', () => {
    let mainMenu: MainMenu;
    let mockScene: jest.Mocked<Phaser.Scene>;

    beforeEach(() => {
        mockScene = {
            add: {
                text: jest.fn(() => ({
                    setInteractive: jest.fn(),
                    on: jest.fn(),
                })),
            },
            input: {
                once: jest.fn(),
            },
            scale: {
                width: 800,
                height: 600,
            },
            scene: {
                start: jest.fn(),
            },
        } as unknown as jest.Mocked<Phaser.Scene>;

        (getSelectedSprite as jest.Mock).mockReturnValue(HorseSprites.whiteBodyWhiteManeHorse);
        mainMenu = new MainMenu();
        Object.assign(mainMenu, mockScene); // Mock Phaser's Scene methods
    });

    it('should initialize the scene correctly in create()', () => {
        mainMenu.create();

        expect(mockScene.add.text).toHaveBeenCalledWith(375, 200, 'Horse Runner', expect.any(Object));
        expect(mockScene.add.text).toHaveBeenCalledWith(400 - 150, 300, '←', expect.any(Object));
        expect(mockScene.add.text).toHaveBeenCalledWith(400 + 150, 300, '→', expect.any(Object));
        expect(mockScene.input.once).toHaveBeenCalledWith('pointerdown', expect.any(Function));
    });

    it('should transition to the Game scene on pointerdown', () => {
        mainMenu.create();

        // Simulate the pointerdown event
        const pointerdownCallback = (mockScene.input.once as jest.Mock).mock.calls[0][1];
        pointerdownCallback();

        expect(mockScene.input.once).toHaveBeenCalledWith('pointerdown', expect.any(Function));
        expect(mockScene.scene.start).toHaveBeenCalledWith('Game');
    });

    it('should update the sprite index and call updateSpriteSheet when left arrow is clicked', () => {
        mainMenu.create();
        const leftArrow = (mockScene.add.text as jest.Mock).mock.results[1].value;
        const mockEvent = { stopPropagation: jest.fn() };

        leftArrow.on.mock.calls[0][1](null, null, null, mockEvent); // Simulate pointerdown event

        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mainMenu['selectedSpriteIndex']).toBe(6);
    });

    it('should update the sprite index and call updateSpriteSheet when right arrow is clicked', () => {
        mainMenu.create();
        const rightArrow = (mockScene.add.text as jest.Mock).mock.results[2].value;
        const mockEvent = { stopPropagation: jest.fn() };

        rightArrow.on.mock.calls[0][1](null, null, null, mockEvent); // Simulate pointerdown event

        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mainMenu['selectedSpriteIndex']).toBe(0);
    });

    it('should update the sprite sheet and state in updateSpriteSheet()', () => {
        const mockPlayer = { updateSpriteSheet: jest.fn() };
        mainMenu['player'] = mockPlayer as unknown as Player;

        mainMenu['updateSpriteSheet'](1);

        expect(mainMenu['selectedSpriteIndex']).toBe(1);
        expect(mockPlayer.updateSpriteSheet).toHaveBeenCalledWith(HorseSprites.blackBodyWhiteManeHorse);
        expect(updateSelectedSprite).toHaveBeenCalledWith(HorseSprites.blackBodyWhiteManeHorse);
    });
});
