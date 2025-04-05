import { GameOver } from './GameOver';

describe('GameOver Scene', () => {
    let gameOverScene: GameOver;
    let mockScene: jest.Mocked<Phaser.Scene>;

    beforeEach(() => {
        mockScene = {
            cameras: {
                main: {
                    setBackgroundColor: jest.fn(),
                },
            },
            add: {
                text: jest.fn(() => ({
                    setOrigin: jest.fn(),
                })),
            },
            input: {
                once: jest.fn(),
            },
            scene: {
                start: jest.fn(),
            },
        } as unknown as jest.Mocked<Phaser.Scene>;

        gameOverScene = new GameOver();
        Object.assign(gameOverScene, mockScene); // Mock Phaser's Scene methods
    });

    it('should set the camera background color to red', () => {
        gameOverScene.create();

        expect(mockScene.cameras.main.setBackgroundColor).toHaveBeenCalledWith(0xff0000);
    });

    it('should add "Game Over" text with correct properties', () => {
        gameOverScene.create();

        expect(mockScene.add.text).toHaveBeenCalledWith(512, 384, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
        });

        const gameOverText = (mockScene.add.text as jest.Mock).mock.results[0].value;
        expect(gameOverText.setOrigin).toHaveBeenCalledWith(0.5);
    });

    it('should transition to the MainMenu scene on pointerdown', () => {
        gameOverScene.create();

        const pointerdownCallback = (mockScene.input.once as jest.Mock).mock.calls[0][1];
        pointerdownCallback(); // Simulate pointerdown event

        expect(mockScene.scene.start).toHaveBeenCalledWith('MainMenu');
    });
});