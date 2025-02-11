import ImageTag from '../../image'

export abstract class BackgroundImage {
    protected image: HTMLImageElement;

    constructor (imagePath: string) {
        this.image = ImageTag.getImage(imagePath);
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
    constructor (imagePath: string, public yOffset: number) {
        super(imagePath);
    }
    public getCanvasYOffset (canvas: HTMLCanvasElement, scale: number) {
        return super.getCanvasYOffset(canvas, scale) - this.yOffset;
    }
}
