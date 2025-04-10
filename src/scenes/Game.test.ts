import { Game } from './Game';
import { Player } from '../gameObjects/Player';

jest.mock('../gameObjects/Player');

describe('Game Scene', () => {
    let gameScene: Game;
    let mockScene: jest.Mocked<Phaser.Scene>;

    beforeEach(() => {
        mockScene = {
            add: {
                group: jest.fn(() => ({
                    add: jest.fn(),
                    getChildren: jest.fn(() => []),
                })),
                tileSprite: jest.fn(() => ({
                    setOrigin: jest.fn().mockReturnThis(),
                    setScale: jest.fn().mockReturnThis(),
                    setScrollFactor: jest.fn().mockReturnThis(),
                })),
                sprite: jest.fn().mockReturnValue({
                    setScale: jest.fn(),
                    setOrigin: jest.fn(),
                }),
            },
            input: {
                keyboard: {
                    createCursorKeys: jest.fn(() => ({
                        left: { isDown: false },
                        right: { isDown: false },
                        up: { isDown: false },
                        down: { isDown: false },
                    })),
                    addKey: jest.fn(() => ({ isDown: false })),
                },
            },
            scale: {
                width: 1024,
                height: 768,
            },
            scene: {
                start: jest.fn(),
            },
            physics: {
                world: {
                    enable: jest.fn(),
                },
                add: {
                    collider: jest.fn(),
                },
                pause: jest.fn(),
            },
            time: {
                delayedCall: jest.fn((_, callback) => {
                    callback();
                }),
            }
        } as unknown as jest.Mocked<Phaser.Scene>;

        gameScene = new Game();
        Object.assign(gameScene, mockScene); // Mock Phaser's Scene methods
    });

    it('should initialize keyboard inputs in init()', () => {
        gameScene.init();

        const mockKeyboard = mockScene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
        expect(mockKeyboard.createCursorKeys).toHaveBeenCalled();
        expect(mockKeyboard.addKey).toHaveBeenCalledWith(Phaser.Input.Keyboard.KeyCodes.R);
        expect(mockKeyboard.addKey).toHaveBeenCalledWith(Phaser.Input.Keyboard.KeyCodes.SPACE);
    });

    it('should create background layers and player in create()', () => {
        gameScene.create();

        expect(mockScene.add.group).toHaveBeenCalled();
        expect(mockScene.add.tileSprite).toHaveBeenCalledWith(0, 200, 5000, 704, 'hillsBackground');
        expect(mockScene.add.tileSprite).toHaveBeenCalledWith(0, 50, 5000, 1242, 'treesBackground');
        expect(mockScene.add.tileSprite).toHaveBeenCalledWith(0, 305, 5000, 992, 'trailBackground');
        expect(Player).toHaveBeenCalledWith(gameScene, 1024 / 2, (768 / 2) + 75);
    });

    it('should handle player movement and background scrolling in update()', () => {
        const mockPlayer = {
            runLeft: jest.fn(),
            walkLeft: jest.fn(),
            runRight: jest.fn(),
            walkRight: jest.fn(),
            moveUp: jest.fn(),
            moveDown: jest.fn(),
            idle: jest.fn(),
            startJumping: jest.fn(),
            handleJumping: jest.fn(),
        };
        gameScene['player'] = mockPlayer as unknown as Player;

        const mockBackgroundLayer = { tilePositionX: 0 };
        gameScene['backgroundGroup'] = {
            getChildren: jest.fn(() => [mockBackgroundLayer]),
        } as unknown as Phaser.GameObjects.Group;

        // Simulate running right
        gameScene['cursors'] = {
            left: { isDown: false },
            right: { isDown: true },
            up: { isDown: false },
            down: { isDown: false },
        } as unknown as Phaser.Types.Input.Keyboard.CursorKeys;
        gameScene['rKey'] = { isDown: true } as unknown as Phaser.Input.Keyboard.Key;
        gameScene.update();

        expect(mockPlayer.runRight).toHaveBeenCalled();
        expect(mockBackgroundLayer.tilePositionX).toBe(gameScene['runVelocity']);

        // Simulate idle
        gameScene['cursors'] = {
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: false },
            down: { isDown: false },
        } as unknown as Phaser.Types.Input.Keyboard.CursorKeys;
        gameScene.update();

        expect(mockPlayer.idle).toHaveBeenCalled();
        expect(mockBackgroundLayer.tilePositionX).toBe(gameScene['runVelocity']); // No change in velocity
    });

    it('should handle up arrow in update()', () => {
        const mockPlayer = {
            handleJumping: jest.fn(),
            moveUp: jest.fn(),
        };
        gameScene['player'] = mockPlayer as unknown as Player;

        // Simulate idle
        gameScene['cursors'] = {
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: true },
            down: { isDown: false },
        } as unknown as Phaser.Types.Input.Keyboard.CursorKeys;

        gameScene.update();

        expect(mockPlayer.moveUp).toHaveBeenCalled();
    });

    it('should handle down arrow in update()', () => {
        const mockPlayer = {
            handleJumping: jest.fn(),
            moveDown: jest.fn(),
        };
        gameScene['player'] = mockPlayer as unknown as Player;

        // Simulate idle
        gameScene['cursors'] = {
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: false },
            down: { isDown: true },
        } as unknown as Phaser.Types.Input.Keyboard.CursorKeys;

        gameScene.update();

        expect(mockPlayer.moveDown).toHaveBeenCalled();
    });

    it('should handle jumping in update()', () => {
        const mockPlayer = {
            startJumping: jest.fn(),
            handleJumping: jest.fn(),
            idle: jest.fn(),
        };
        gameScene['player'] = mockPlayer as unknown as Player;

        gameScene['spaceKey'] = { isDown: true } as unknown as Phaser.Input.Keyboard.Key;
        gameScene.update();

        expect(mockPlayer.startJumping).toHaveBeenCalled();
        expect(mockPlayer.handleJumping).toHaveBeenCalled();
    });

    it('should handle when isPlayerDead when hitObstacle in update()', () => {
        const mockPlayer = {
            setTint: jest.fn(),
            play: jest.fn(),
            dead: jest.fn(),
        } as unknown as Player;
        gameScene['player'] = mockPlayer as unknown as Player;
        const mockObstacle = {
            setTint: jest.fn(),
        } as unknown as Phaser.GameObjects.Sprite;
        gameScene.hitObstacle(mockPlayer, mockObstacle);

        expect(gameScene.scene.start).toHaveBeenCalled();

        gameScene.update();
        expect(mockPlayer.dead).toHaveBeenCalled();
    });
});