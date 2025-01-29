// TODO: Convert to Builder class
export default class Sound {
    private element: HTMLAudioElement;

    constructor (src: string) {
        this.element = document.createElement('audio');
        this.element.src = src;
    }

    static createAutoPlayLoop (src: string): Sound {
        const sound = new Sound(src);
        sound.setAutoplay();
        sound.setLoop();
        return sound;
    }

    public play () {
        this.element.play();
    }

    public stop () {
        this.element.pause();
    }

    public setAutoplay () {
        this.element.autoplay;
    }

    public setLoop () {
        this.element.loop;
    }
}
