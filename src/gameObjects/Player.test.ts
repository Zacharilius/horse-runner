import { JUMP_FRAME_COUNT, Player } from './Player';
import { getSelectedSprite } from '../state';
import { HorseSprites } from './horseSprites';

jest.mock('../state');

const mockScene =  {
    add: {
        existing: jest.fn(),
    },
    anims: {
        create: jest.fn(),
        generateFrameNumbers: jest.fn(),
        play: jest.fn(),
        remove: jest.fn(),
    },
    time: {
        delayedCall: jest.fn(),
    },
    sound: {
        play: jest.fn(),
        stopByKey: jest.fn(),
        isPlaying: jest.fn(() => false),
    },
} as unknown as Phaser.Scene;

jest.mock('Phaser', () => {
    return {
        Physics: {
            Arcade: {
                Sprite: jest.fn().mockImplementation(function (value) {
                    // @ts-expect-error make test work.
                    this.value = value;
                    // @ts-expect-error make test work.
                    this.setScale = jest.fn();
                    // @ts-expect-error make test work.
                    this.setTexture = jest.fn();
                    // @ts-expect-error make test work.
                    this.anims = mockScene.anims;
                    // @ts-expect-error make test work.
                    this.time = mockScene.time;
                    // @ts-expect-error make test work.
                    this.sound = mockScene.sound;
                    // @ts-expect-error make test work.
                    this.scene = mockScene;
                }),
            },
        }
    }
});

describe('Player', () => {
    let player: Player;

    beforeEach(() => {
        (getSelectedSprite as jest.Mock).mockReturnValue('whiteBodyWhiteManeHorse');
        player = new Player(mockScene, 100, 200);
    });

    it('should initialize with the correct sprite and animations', () => {
        expect(mockScene.add.existing).toHaveBeenCalledWith(player);
        expect(mockScene.anims.create).toHaveBeenCalled(); // Ensure animations are created
    });

    it('should update the sprite sheet and reinitialize animations', () => {
        player.updateSpriteSheet(HorseSprites.blackBodyGrayManeHorse);

        expect(mockScene.anims.remove).toHaveBeenCalledWith('leftWalk');
        expect(mockScene.anims.remove).toHaveBeenCalledWith('leftRun');
        expect(mockScene.anims.remove).toHaveBeenCalledWith('rightWalk');
        expect(mockScene.anims.remove).toHaveBeenCalledWith('rightRun');
        expect(mockScene.anims.remove).toHaveBeenCalledWith('up');
        expect(mockScene.anims.remove).toHaveBeenCalledWith('down');
        expect(mockScene.anims.remove).toHaveBeenCalledWith('turn');
        expect(mockScene.anims.create).toHaveBeenCalled(); // Ensure animations are recreated
    });

    it('should play the correct animation and sound when walking left', () => {
        player.walkLeft();

        expect(mockScene.anims.play).toHaveBeenCalledWith('leftWalk', true);
        expect(mockScene.sound.play).toHaveBeenCalledWith('walking');
    });

    it('should play the correct animation and sound when running left', () => {
        player.runLeft();

        expect(mockScene.anims.play).toHaveBeenCalledWith('leftRun', true);
        expect(mockScene.sound.play).toHaveBeenCalledWith('galloping');
    });

    it('should play the correct animation and sound when walking right', () => {
        player.walkRight();

        expect(mockScene.anims.play).toHaveBeenCalledWith('rightWalk', true);
        expect(mockScene.sound.play).toHaveBeenCalledWith('walking');
    });

    it('should play the correct animation and sound when running right', () => {
        player.runRight();

        expect(mockScene.anims.play).toHaveBeenCalledWith('rightRun', true);
        expect(mockScene.sound.play).toHaveBeenCalledWith('galloping');
    });

    it('should move up and play the correct animation and sound', () => {
        player.y = 350; // Within bounds
        player.moveUp();

        expect(mockScene.anims.play).toHaveBeenCalledWith('up', true);
        expect(mockScene.sound.play).toHaveBeenCalledWith('walking');
        expect(player.y).toBe(349); // Moved up by 1
    });

    it('should move down and play the correct animation and sound', () => {
        player.y = 350; // Within bounds
        player.moveDown();

        expect(mockScene.anims.play).toHaveBeenCalledWith('down', true);
        expect(mockScene.sound.play).toHaveBeenCalledWith('walking');
        expect(player.y).toBe(351); // Moved down by 1
    });

    it('should play the idle animation and stop sounds', () => {
        player.idle();

        expect(mockScene.anims.play).toHaveBeenCalledWith('turn');
        expect(mockScene.sound.isPlaying).toHaveBeenCalledWith('walking');
        expect(mockScene.sound.isPlaying).toHaveBeenCalledWith('galloping');
    });

    it('should handle jumping logic correctly', () => {
        player.y = -200;
        // Not Jumping
        expect(player['isJumping']).toBe(false);
        expect(player['isJumpingUp']).toBe(false);
        expect(player['isJumpingDown']).toBe(false);
        player.startJumping();

        // Jumping up
        for (let i = 0; i < JUMP_FRAME_COUNT; i++) {
            expect(player['isJumping']).toBe(true);
            expect(player['isJumpingUp']).toBe(true);
            expect(player['isJumpingDown']).toBe(false);
            player.handleJumping();
        }

        // Jumping down
        for (let i = 0; i < JUMP_FRAME_COUNT; i++) {
            expect(player['isJumping']).toBe(true);
            expect(player['isJumpingUp']).toBe(false);
            expect(player['isJumpingDown']).toBe(true);
            player.handleJumping();
        }

        // Finish jumping
        expect(player['isJumping']).toBe(false);
        expect(player['isJumpingUp']).toBe(false);
        expect(player['isJumpingDown']).toBe(false);
    });
});
