import { Scene } from 'phaser';

export class MainMenu extends Scene{
    constructor () {
        super('MainMenu');
    }

    create () {
        this.add.text(375, 200, 'Horse Runner', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
