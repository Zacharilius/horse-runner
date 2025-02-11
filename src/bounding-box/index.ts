export interface BoundingBox {
    left: number;
    top: number;
    width: number;
    height: number;
}

export const isCollision = (
    boundingBox1: BoundingBox,
    boundingBox2: BoundingBox,
): boolean => {
    if (
        boundingBox1.left < boundingBox2.left + boundingBox2.width &&
        boundingBox1.left + boundingBox1.width > boundingBox2.left &&
        boundingBox1.top < boundingBox2.top + boundingBox2.height &&
        boundingBox1.top + boundingBox1.height > boundingBox2.top
    ) {
        console.log('collision!!!')
        return true;
    } else {
        return false;
    }
}
