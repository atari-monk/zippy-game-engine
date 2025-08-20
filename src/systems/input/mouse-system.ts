export class MouseSystem {
    private x: number;
    private y: number;
    private buttons: Record<number, boolean>;
    private wheel: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.buttons = {};
        this.wheel = 0;
    }

    setupCanvasEvents(canvas: HTMLElement): void {
        const options = { passive: false };

        canvas.addEventListener(
            "mousemove",
            (e: MouseEvent) => {
                const rect = canvas.getBoundingClientRect();
                this.x = e.clientX - rect.left;
                this.y = e.clientY - rect.top;
            },
            options
        );

        canvas.addEventListener(
            "mousedown",
            (e: MouseEvent) => {
                this.buttons[e.button] = true;
            },
            options
        );

        canvas.addEventListener(
            "mouseup",
            (e: MouseEvent) => {
                this.buttons[e.button] = false;
            },
            options
        );

        canvas.addEventListener(
            "wheel",
            (e: WheelEvent) => {
                this.wheel = e.deltaY;
                e.preventDefault();
            },
            { passive: false }
        );
    }

    update(): void {
        this.wheel = 0;
    }

    isButtonDown(button: number): boolean {
        return this.buttons[button] || false;
    }

    getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    getWheel(): number {
        return this.wheel;
    }
}
