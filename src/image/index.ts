export const getImage = (src: string): HTMLImageElement => {
    let img = new Image();
    img.src = src;
    return img;
}
