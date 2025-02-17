import Horse, { HorseMovementDirections } from './index';
import Background from '../background';
import { isCollision } from '../bounding-box';
import Obstacle from '../obstacle';
import Sound from '../sound';

const SOUND_INDEX_FOR_NEIGHING = 2;

jest.mock('../background');
jest.mock('../bounding-box');
jest.mock('../obstacle');
jest.mock('../sound');

class HorseTester {
    private horse: Horse;
    private keyDownEventHandler: EventListener;
    private keyUpEventHandler: EventListener;
    private tickEventCallback: EventListener;
    private context: CanvasRenderingContext2D;

    constructor () {
        const canvas = getCanvas();
        jest.spyOn(canvas, 'addEventListener');
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        jest.spyOn(this.context, 'drawImage');

        const background = new Background(canvas)
        this.horse = new Horse(
            canvas,
            background,
            new Obstacle(canvas, background),
        );
        
        this.keyDownEventHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
        this.keyUpEventHandler = addEventListenerSpy.mock.calls[1][1] as EventListener;
        this.tickEventCallback = canvas.addEventListener.mock.calls[0][1] as EventListener
    }

    public getContext (): CanvasRenderingContext2D {
        return this.context;
    }

    public fireTickEvent () {
        this.tickEventCallback(new Event('tick'));
    }

    // =========================================================================
    // Jumping

    public startHorseJumping () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: ' ' }));
    }

    // =========================================================================
    // Movement and Direction

    public startHorseWalkingUp () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 'ArrowUp' }));    
    }

    public startHorseWalkingRight () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 'ArrowRight' }));            
    }

    public startHorseWalkingDown () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    }

    public startHorseWalkingLeft () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    }

    public stopHorseWalkingLeft () {
        this.keyUpEventHandler(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    }

    public startHorseRunning () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 'r' }));
    }

    public stopHorseRunning () {
        this.keyUpEventHandler(new KeyboardEvent('keyup', { key: 'r' }));
    }

    // =========================================================================
    // Sound

    public neigh () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 'n' }));
    }

    // =========================================================================
    // Sound

    public changeHorseImage () {
        this.keyDownEventHandler(new KeyboardEvent('keydown', { key: 's' }));
    }

    // =========================================================================
    // State

    public isHorseWalking (): boolean {
        return this.horse._getHorseState().isHorseMoving;
    }

    public isHorseRunning (): boolean {
        return this.horse._getHorseState().isHorseRunning;
    }

    public getHorseDirection (): HorseMovementDirections {
        return this.horse._getHorseState().horseDirection;
    }

    public getHorseIndex (): number {
        return this.horse._getHorseState().imageIndex;
    }

    public isHorseJumping (): boolean {
        return this.horse._getHorseState().isJumping;
    }

    public isHorseDying (): boolean {
        return this.horse._getHorseState().isDying;
    }
}

beforeEach(() => {
    jest.clearAllMocks()
});

const getCanvas = (): jest.Mocked<HTMLCanvasElement> => {
    return document.createElement('canvas') as jest.Mocked<HTMLCanvasElement>;;
}

const getHorse = (canvas: HTMLCanvasElement): Horse => {
    const background = new Background(canvas)
    const horse = new Horse(
        canvas,
        background,
        new Obstacle(canvas, background),
    );
    return horse;
}

// =============================================================================
// Init

test('Horse - should initialize', () => {
    expect(getHorse(getCanvas())).toBeInstanceOf(Horse);
});

// =============================================================================
// Key presses and state

// -----------------------------------------------------------------------------
// Movement

test('Horse - should move left when left arrow pressed', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingLeft();
    horseTester.fireTickEvent();
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.left);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        64,
        384,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
});

test('Horse - should run left when left arrow and r are pressed', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingLeft();
    horseTester.startHorseRunning();
    horseTester.fireTickEvent();
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.left);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        64,
        576,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
});

test('Horse - should move right when right arrow pressed', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingRight();
    horseTester.fireTickEvent();
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.right);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        64,
        432,
        64,
        48,
        118,
        72.5,
        64,
        48
    );
});

test('Horse - should move up when up arrow pressed', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingUp();
    horseTester.fireTickEvent();
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.up);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        64,
        528,
        64,
        48,
        118,
        71.5,
        64,
        48
    );
});

test('Horse - should move down when down arrow pressed', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingDown();
    horseTester.fireTickEvent();
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.down);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        64,
        480,
        64,
        48,
        118,
        73.5,
        64,
        48
    );
});

test('Horse - should move down when horse is Running arrow pressed', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingDown();
    horseTester.startHorseRunning();
    horseTester.fireTickEvent();
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.down);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(
        expect.any(HTMLImageElement),
        64,
        672,
        64,
        48,
        118,
        73.5,
        64,
        48
    );
});

test('Horse - should wrap around when lots of ticks are called', () => {
    const horseTester = new HorseTester();
    horseTester.startHorseWalkingLeft();
    // 29 is enough ticks for it to reset frames several times.
    const TICK_COUNT = 20;
    for (let i = 0; i < TICK_COUNT; i ++) {
        horseTester.fireTickEvent();
    }
    expect(horseTester.getHorseDirection()).toBe(HorseMovementDirections.left);
    const context = horseTester.getContext();
    expect(context.drawImage).toHaveBeenCalledTimes(TICK_COUNT);
});

// -----------------------------------------------------------------------------
// Switch horse

test('Horse - should switch horse image when "s" is pressed', () => {
    const horseTester = new HorseTester();

    expect(horseTester.getHorseIndex()).toBe(0);
    horseTester.changeHorseImage();
    expect(horseTester.getHorseIndex()).toBe(1);
});

test('Horse - should switch back to original horse  image when "s" is pressed', () => {
    const horseTester = new HorseTester();

    const HORSE_SPRITE_COUNT = 7;
    for (let i = 0; i <= HORSE_SPRITE_COUNT; i++) {
        horseTester.changeHorseImage();
    }
    expect(horseTester.getHorseIndex()).toBe(0);
});

// -----------------------------------------------------------------------------
// Neigh

test('Horse - should play neighing sound when "n" key is pressed', () => {
   const horseTester = new HorseTester();

    // Creates 3 sounds.
    expect(Sound).toHaveBeenCalledTimes(3);
    const mockNeighingSound = (Sound as jest.Mock).mock.instances[SOUND_INDEX_FOR_NEIGHING];

    horseTester.neigh();
    expect(mockNeighingSound.play).toHaveBeenCalledTimes(1);
});

// -----------------------------------------------------------------------------
// Running

test('Horse - should start and stop horse running when pressing and unpressing "r"', () => {
    const horseTester = new HorseTester();

    expect(horseTester.isHorseRunning()).toBe(false);
    horseTester.startHorseRunning();
    expect(horseTester.isHorseRunning()).toBe(true);
    horseTester.stopHorseRunning();
    expect(horseTester.isHorseRunning()).toBe(false);
});

test('Horse - should start and stop moving when "ArrowUp" key up is pressed', () => {
    const horseTester = new HorseTester();

    expect(horseTester.isHorseWalking()).toBe(false);
    horseTester.startHorseWalkingLeft()
    expect(horseTester.isHorseWalking()).toBe(true);
    horseTester.stopHorseWalkingLeft();
    expect(horseTester.isHorseWalking()).toBe(false);
});

// -----------------------------------------------------------------------------
// Jumping

test('Horse - should jump when " " key up is pressed', () => {
    const horseTester = new HorseTester();

    horseTester.startHorseJumping();

    // Really 6 up and 6 down;
    const FRAME_COUNT_FOR_JUMPING = 12;
    for (let i = 0; i < FRAME_COUNT_FOR_JUMPING; i++) {
        expect(horseTester.isHorseJumping()).toBe(true);
        horseTester.fireTickEvent();
    }
    expect(horseTester.isHorseJumping()).toBe(false);
});

// =============================================================================
// Collision

test('Horse - should die when the horse collides with an obstacle', () => {
    (isCollision as jest.Mock).mockReturnValue(true);
    const horseTester = new HorseTester();
    horseTester.fireTickEvent();

    // Should die and stay dead. 20 is more than the number of ticks.
    for (let i = 0; i < 20; i++) {
        horseTester.fireTickEvent();
        expect(horseTester.isHorseDying()).toBe(true);
    }
    const context = horseTester.getContext();
    expect(context.fillStyle).toBe('#ff0000');
    expect(context.fillRect).toHaveBeenCalled();
});
