import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';
import { getSelectedSprite, updateSelectedSprite } from '../state';
import { HorseSprites } from "../gameObjects/horseSprites";

const OFFSET_TO_APPEAR_CENTER = 25;

export class MainMenu extends Scene{
    private player: Player | undefined;
    private selectedSpriteIndex = 0;
    private spriteSheetNames = Object.values(HorseSprites);

    constructor () {
        super('MainMenu');
    }

    create () {
        this.selectedSpriteIndex = this.spriteSheetNames.indexOf(getSelectedSprite()) ?? 0;

        this.add.text(375, 200, 'Horse Runner', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });

        const { width, height } = this.scale
        this.player = new Player(this, width / 2 + OFFSET_TO_APPEAR_CENTER, (height / 2));

        const leftArrow = this.add.text(width / 2 - 150, height / 2, '←', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, backgroundColor: '#000000',
            align: 'center'
        });
        leftArrow.setInteractive();
        leftArrow.on('pointerdown', (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            this.updateSpriteSheet(this.selectedSpriteIndex - 1);
        });

        const rightArrow = this.add.text(width / 2 + 150, height / 2, '→', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, backgroundColor: '#000000',
            align: 'center'
        });
        rightArrow.setInteractive();
        rightArrow.on('pointerdown', (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            this.updateSpriteSheet(this.selectedSpriteIndex + 1);
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }

    private updateSpriteSheet(newSpritesheetIndex: number) {
        this.selectedSpriteIndex = (newSpritesheetIndex + this.spriteSheetNames.length) % this.spriteSheetNames.length;
        const spriteName = this.spriteSheetNames[this.selectedSpriteIndex];
        this.player?.updateSpriteSheet(spriteName);
        updateSelectedSprite(spriteName);
    }
}
