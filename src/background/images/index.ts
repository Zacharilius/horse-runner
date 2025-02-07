import ImageTag from '../../image'

export abstract class BackgroundImage {
    protected image: HTMLImageElement;

    constructor (imagePath: string) {
        this.image = ImageTag.getImage(imagePath);
    }

    public getElement (): HTMLImageElement {
        return this.image;
    }

    abstract getCanvasXOffset (canvas: HTMLCanvasElement, scale: number): number;
}

export class BackgroundImageOnBottom extends BackgroundImage{
    constructor (imagePath: string) {
        super(imagePath);
    }
    public getCanvasXOffset (canvas: HTMLCanvasElement, scale: number) {
        return canvas.height - (this.image.height * scale)
    }
}

export class BackgroundImageOnBottomWithOffset extends BackgroundImageOnBottom{
    constructor (imagePath: string, public yOffset: number) {
        super(imagePath);
    }
    public getCanvasXOffset (canvas: HTMLCanvasElement, scale: number) {
        return super.getCanvasXOffset(canvas, scale) - this.yOffset;
    }
}
