import { GamepadInputProcessor } from "./gamepad/gamepad-input-processor.js";
import { KeyboardSystem } from "./keyboard-system.js";
import { MouseSystem } from "./mouse-system.js";
import { TouchSystem } from "./touch-system.js";

export class InputSystem {
    readonly keyboard: KeyboardSystem;
    readonly mouse: MouseSystem;
    readonly gamepads: GamepadInputProcessor;
    readonly touches: TouchSystem;

    constructor() {
        this.keyboard = new KeyboardSystem();
        this.mouse = new MouseSystem();
        this.gamepads = new GamepadInputProcessor();
        this.touches = new TouchSystem();
    }

    setupCanvasEvents(canvas: HTMLElement): void {
        this.mouse.setupCanvasEvents(canvas);
        this.touches.setupCanvasEvents(canvas);
    }

    update(): void {
        this.gamepads.update();
        this.mouse.update();
    }
}
