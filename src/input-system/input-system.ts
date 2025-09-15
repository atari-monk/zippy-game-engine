import { GamepadInputProcessor } from "./gamepad-input-processor.js";
import { KeyboardSystem } from "./keyboard-system.js";
import { MouseSystem } from "./mouse-system.js";
import { DefaultTouchEventSystem } from "./touch-system.js";
import type { TouchEventSystem } from "./type/touch-event-system.js";

export class InputSystem {
    readonly keyboard: KeyboardSystem;
    readonly mouse: MouseSystem;
    readonly gamepads: GamepadInputProcessor;
    readonly touches: TouchEventSystem;

    constructor() {
        this.keyboard = new KeyboardSystem();
        this.mouse = new MouseSystem();
        this.gamepads = new GamepadInputProcessor();
        this.touches = new DefaultTouchEventSystem();
    }

    setupCanvasEvents(canvas: HTMLElement): void {
        this.mouse.setupCanvasEvents(canvas);
    }

    update(): void {
        this.gamepads.update();
        this.mouse.update();
    }
}
