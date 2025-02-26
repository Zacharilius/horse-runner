export default class ImageTag {
    private element: HTMLImageElement;

    constructor (src: string) {
        this.element = new Image();
        this.element.src = src;
    }

    static async getImage (src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const imageTag = new ImageTag(src)
            const element = imageTag.getElement();
            element.onload = () => resolve(imageTag.getElement());
            element.onerror = () => reject;
    
        })
    }

    private getElement (): HTMLImageElement {
        return this.element;
    }
}
