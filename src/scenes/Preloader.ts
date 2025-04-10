import { Scene } from 'phaser';
import { HorseSprites } from '../gameObjects/horseSprites';

export class Preloader extends Scene {
    constructor () {
        super('Preloader');
    }

    init () {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload () {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        // Backgrounds
        this.load.image('hillsBackground', 'background/hills.png');
        this.load.image('trailBackground', 'background/trail.png');
        this.load.image('treesBackground', 'background/trees.png');

        // Horses
        Object.keys(HorseSprites).forEach((key) => {
            const horseSprite = HorseSprites[key as keyof typeof HorseSprites];
            this.load.spritesheet(
                horseSprite,
                `horses/images/${horseSprite}.png`,
                { frameWidth: 64, frameHeight: 48 }
            );
        });

        // Obstacles
        this.load.image('obstacle', 'rock1.png');

        // Sounds
        this.load.audio('galloping', 'horses/sounds/horse-galloping.wav');
        this.load.audio('neigh', 'horses/sounds/horse-neigh.mp3');
        this.load.audio('scream', 'horses/sounds/horse-scream.mp3');
        this.load.audio('walking', 'horses/sounds/horse-walking.mp3');
    }

    create () {
        this.scene.start('MainMenu');
    }
}
