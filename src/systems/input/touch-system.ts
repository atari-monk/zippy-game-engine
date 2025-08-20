export class TouchSystem {
    private touches: Map<number, { x: number; y: number }>;

    constructor() {
        this.touches = new Map();
    }

    setupCanvasEvents(canvas: HTMLElement): void {
        const options = { passive: false, capture: false };

        canvas.addEventListener(
            "touchstart",
            (e: TouchEvent) => {
                this.#handleTouchEvent(e, canvas);
                e.preventDefault();
            },
            options
        );

        canvas.addEventListener(
            "touchmove",
            (e: TouchEvent) => {
                this.#handleTouchEvent(e, canvas);
                e.preventDefault();
            },
            options
        );

        canvas.addEventListener(
            "touchend",
            (e: TouchEvent) => {
                for (const touch of Array.from(e.changedTouches)) {
                    this.touches.delete(touch.identifier);
                }
                e.preventDefault();
            },
            options
        );
    }

    #handleTouchEvent(e: TouchEvent, canvas: HTMLElement): void {
        for (const touch of Array.from(e.changedTouches)) {
            const rect = canvas.getBoundingClientRect();
            this.touches.set(touch.identifier, {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            });
        }
    }

    getCount(): number {
        return this.touches.size;
    }

    getPositions(): { x: number; y: number }[] {
        return Array.from(this.touches.values());
    }

    getPosition(id: number): { x: number; y: number } | null {
        return this.touches.get(id) || null;
    }
}
