import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

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

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        // Backgrounds
        this.load.image('hillsBackground', '/background/hills.png');
        this.load.image('trailBackground', '/background/trail.png');
        this.load.image('treesBackground', '/background/trees.png');

        // Horses
        this.load.spritesheet(
            'whiteBodyWhiteManeHorse',
            '/horses/whiteBodyWhiteManeHorse.png',
            // 24 rows & 8 columns
            // 512 x 1152
            // const FRAME_WIDTH = 64;
            // const FRAME_HEIGHT = 48;
            { frameWidth: 64, frameHeight: 48, scale: 2 }
            // { frameWidth: 32, frameHeight: 48 }
        );

        // Template: TODO REMOVE
        this.load.image('logo', 'logo.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('phaser', 'phaser.png');
        this.load.image('ground', 'platform.png');
        this.load.image('sky', 'sky.png');
        this.load.image('star', 'star.png');
        // this.load.spritesheet(
        //     'dude',
        //     'dude.png',
        //     { frameWidth: 32, frameHeight: 48 }
        // );
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
