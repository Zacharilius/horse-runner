export default class Sound {
    private element: HTMLAudioElement;

    constructor (src: string) {
        this.element = document.createElement('audio');
        this.element.src = src;
    }

    // Static Constructor
    static createAutoPlayLoop (src: string): Sound {
        const sound = new Sound(src)
            .setAutoplay()
            .setLoop();
        return sound;
    }

    public play () {
        this.element.play();
    }

    public stop () {
        this.element.pause();
    }

    public setAutoplay (): Sound {
        this.element.autoplay;
        return this;
    }

    public setLoop (): Sound {
        this.element.loop;
        return this;
    }

    public setPlaybackRate (playbackRate: number): Sound {
        this.element.playbackRate = playbackRate;
        return this;
    }
}
