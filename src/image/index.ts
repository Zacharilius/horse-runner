export default class ImageTag {
    private element: HTMLImageElement;

    constructor (src: string) {
        this.element = new Image();
        this.element.src = src;
    }

    static getImage (src: string): HTMLImageElement {
        return new ImageTag(src).getElement()
    }

    public getElement (): HTMLImageElement {
        return this.element;
    }
}