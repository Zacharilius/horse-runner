export default class Sound {
    private element: HTMLAudioElement;

    constructor (src: string) {
        this.element = document.createElement('audio');
        this.element.src = src;
    }

    public play () {
        this.element.play();
    }

    public stop () {
        this.element.pause();
    }

    public setPlaybackRate (playbackRate: number): Sound {
        this.element.playbackRate = playbackRate;
        return this;
    }
}
