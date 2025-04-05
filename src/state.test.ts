import { getSelectedSprite, updateSelectedSprite } from './state';
import { HorseSprites } from './gameObjects/horseSprites';

jest.mock('./gameObjects/horseSprites', () => ({
    HorseSprites: {
        whiteBodyWhiteManeHorse: 'whiteBodyWhiteManeHorse',
        blackBodyGrayManeHorse: 'blackBodyGrayManeHorse',
    },
}));

describe('state module', () => {
    it('should return the default sprite if not updated', () => {
        expect(getSelectedSprite()).toBe(HorseSprites.whiteBodyWhiteManeHorse);
    });
    it('should update the selected sprite', () => {
        updateSelectedSprite(HorseSprites.blackBodyGrayManeHorse);
        expect(getSelectedSprite()).toBe(HorseSprites.blackBodyGrayManeHorse);
    });
});
