import { BoundingBox, isCollision } from './index';


test('bounding-box - should correctly identify a collision', () => {
    const boundingBoxA: BoundingBox = {
        left: 140,
        top: 122.9,
        width: 21.3,
        height: 9.6,
    };
    const boundingBoxB: BoundingBox = {
        left: 148,
        top: 122,
        width: 5,
        height: 10,
    };
    expect(isCollision(boundingBoxA, boundingBoxB)).toBe(true);
});

test('bounding-box - should correctly identify not a collision', () => {
    const boundingBoxA: BoundingBox = {
        left: 0,
        top: 122,
        width: 5,
        height: 10,
    };
    const boundingBoxB: BoundingBox = {
        left: 140,
        top: 110,
        width: 21,
        height: 9,
    };
    expect(isCollision(boundingBoxA, boundingBoxB)).toBe(false);
});