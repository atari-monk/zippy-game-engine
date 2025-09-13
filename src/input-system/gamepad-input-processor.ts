import { GamepadConnectionTracker } from "./gamepad-connection-tracker.js";

export class GamepadInputProcessor {
    private gamepadConnectionTracker: GamepadConnectionTracker;
    private previousStates: (Gamepad | null)[];
    private deadZones: Record<number, number>;
    private buttonMap: Record<string, number>;
    private axisMap: Record<string, number>;

    constructor() {
        this.gamepadConnectionTracker = new GamepadConnectionTracker();
        this.previousStates = [];
        this.deadZones = {};

        this.buttonMap = {
            A: 0,
            B: 1,
            X: 2,
            Y: 3,
            LB: 4,
            RB: 5,
            LT: 6,
            RT: 7,
            Back: 8,
            Start: 9,
            LStick: 10,
            RStick: 11,
            DUp: 12,
            DDown: 13,
            DLeft: 14,
            DRight: 15,
        };

        this.axisMap = {
            LeftStickX: 0,
            LeftStickY: 1,
            RightStickX: 2,
            RightStickY: 3,
        };

        this.setDeadZone(0, 0.2);
        this.setDeadZone(1, 0.2);
        this.setDeadZone(2, 0.2);
        this.setDeadZone(3, 0.2);
    }

    update(): void {
        this.previousStates = [
            ...this.gamepadConnectionTracker.getConnectedGamepads(),
        ];
        this.gamepadConnectionTracker.update();
    }

    isButtonDown(gamepadIndex: number, button: string | number): boolean {
        const buttonIndex =
            typeof button === "string" ? this.buttonMap[button] : button;
        const gamepad = this.gamepadConnectionTracker.getGamepad(gamepadIndex);
        return gamepad?.buttons[buttonIndex]?.pressed || false;
    }

    isButtonPressed(gamepadIndex: number, button: string | number): boolean {
        const buttonIndex =
            typeof button === "string" ? this.buttonMap[button] : button;
        const current = this.gamepadConnectionTracker.getGamepad(gamepadIndex);
        const previous = this.previousStates[gamepadIndex];

        return (
            (current?.buttons[buttonIndex]?.pressed &&
                !previous?.buttons[buttonIndex]?.pressed) ||
            false
        );
    }

    isButtonReleased(gamepadIndex: number, button: string | number): boolean {
        const buttonIndex =
            typeof button === "string" ? this.buttonMap[button] : button;
        const current = this.gamepadConnectionTracker.getGamepad(gamepadIndex);
        const previous = this.previousStates[gamepadIndex];

        return (
            (!current?.buttons[buttonIndex]?.pressed &&
                previous?.buttons[buttonIndex]?.pressed) ||
            false
        );
    }

    getAxis(gamepadIndex: number, axis: string | number): number {
        const axisIndex = typeof axis === "string" ? this.axisMap[axis] : axis;
        const gamepad = this.gamepadConnectionTracker.getGamepad(gamepadIndex);
        const value = gamepad?.axes[axisIndex] || 0;

        const deadZone = this.deadZones[axisIndex] || 0;
        if (Math.abs(value) < deadZone) return 0;

        return value;
    }

    setButtonMapping(action: string, buttonIndex: number): void {
        this.buttonMap[action] = buttonIndex;
    }

    setAxisMapping(action: string, axisIndex: number): void {
        this.axisMap[action] = axisIndex;
    }

    setDeadZone(axisIndex: number, deadZone: number): void {
        this.deadZones[axisIndex] = deadZone;
    }

    vibrate(
        gamepadIndex: number,
        duration: number,
        weakMagnitude: number,
        strongMagnitude: number
    ): boolean {
        const gamepad = this.gamepadConnectionTracker.getGamepad(gamepadIndex);
        if (!gamepad?.vibrationActuator) return false;

        gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration,
            weakMagnitude,
            strongMagnitude,
        });
        return true;
    }
}
