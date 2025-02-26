export abstract class BackgroundImage {
    protected image: HTMLImageElement;

    constructor (image: HTMLImageElement) {
        this.image = image;
    }

    public getElement (): HTMLImageElement {
        return this.image;
    }

    abstract getCanvasYOffset (canvas: HTMLCanvasElement, scale: number): number;
}

export class BackgroundImageOnBottom extends BackgroundImage{
    public getCanvasYOffset (canvas: HTMLCanvasElement, scale: number) {
        return canvas.height - (this.image.height * scale)
    }
}

export class BackgroundImageOnBottomWithOffset extends BackgroundImageOnBottom{
    constructor (image: HTMLImageElement, public yOffset: number) {
        super(image);
    }
    public getCanvasYOffset (canvas: HTMLCanvasElement, scale: number) {
        return super.getCanvasYOffset(canvas, scale) - this.yOffset;
    }
}
