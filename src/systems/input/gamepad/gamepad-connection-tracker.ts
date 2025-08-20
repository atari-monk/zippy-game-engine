export class GamepadConnectionTracker {
    private gamepads: (Gamepad | null)[] = [];
    private boundHandleGamepadConnected: (e: GamepadEvent) => void;
    private boundHandleGamepadDisconnected: (e: GamepadEvent) => void;

    constructor() {
        this.boundHandleGamepadConnected =
            this.handleGamepadConnected.bind(this);
        this.boundHandleGamepadDisconnected =
            this.handleGamepadDisconnected.bind(this);

        this.setupEventListeners();
        this.update();
    }

    public getGamepad(index: number = 0): Gamepad | null {
        if (index < 0 || index >= this.gamepads.length) {
            return null;
        }
        return this.gamepads[index];
    }

    public getConnectedGamepads(): Gamepad[] {
        return Array.from(navigator.getGamepads()).filter(
            (gp) => gp !== null
        ) as Gamepad[];
    }

    public update(): void {
        this.gamepads = navigator.getGamepads();
    }

    public destroy(): void {
        this.removeEventListeners();
        this.gamepads = [];
    }

    private setupEventListeners(): void {
        window.addEventListener(
            "gamepadconnected",
            this.boundHandleGamepadConnected
        );
        window.addEventListener(
            "gamepaddisconnected",
            this.boundHandleGamepadDisconnected
        );
    }

    private removeEventListeners(): void {
        window.removeEventListener(
            "gamepadconnected",
            this.boundHandleGamepadConnected
        );
        window.removeEventListener(
            "gamepaddisconnected",
            this.boundHandleGamepadDisconnected
        );
    }

    private handleGamepadConnected(e: GamepadEvent): void {
        console.log(`Gamepad connected: ${e.gamepad.id}`);
        this.update();
    }

    private handleGamepadDisconnected(e: GamepadEvent): void {
        console.log(`Gamepad disconnected: ${e.gamepad.id}`);
        this.update();
    }
}
