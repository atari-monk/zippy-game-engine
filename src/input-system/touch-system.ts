export class TouchSystem {
    private touches: Map<number, { x: number; y: number }>;
    private touchStates: Map<number, boolean>;
    private previousTouchStates: Map<number, boolean>;
    private touchStartPositions: Map<number, { x: number; y: number }>;

    constructor() {
        this.touches = new Map();
        this.touchStates = new Map();
        this.previousTouchStates = new Map();
        this.touchStartPositions = new Map();
    }

    setupCanvasEvents(canvas: HTMLElement): void {
        const options = { passive: false, capture: false };

        canvas.addEventListener(
            "touchstart",
            (e: TouchEvent) => {
                this.#handleTouchEvent(e, canvas);
                Array.from(e.changedTouches).forEach((touch) => {
                    this.touchStates.set(touch.identifier, true);
                    const rect = canvas.getBoundingClientRect();
                    this.touchStartPositions.set(touch.identifier, {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    });
                });
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
                    this.touchStates.set(touch.identifier, false);
                    this.touchStartPositions.delete(touch.identifier);
                }
                e.preventDefault();
            },
            options
        );

        canvas.addEventListener(
            "touchcancel",
            (e: TouchEvent) => {
                for (const touch of Array.from(e.changedTouches)) {
                    this.touches.delete(touch.identifier);
                    this.touchStates.set(touch.identifier, false);
                    this.touchStartPositions.delete(touch.identifier);
                }
                e.preventDefault();
            },
            options
        );
    }

    update(): void {
        this.previousTouchStates = new Map(this.touchStates);
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

    isTouching(): boolean {
        return Array.from(this.touchStates.values()).some((state) => state);
    }

    isTouchStarted(): boolean {
        for (const [id, current] of this.touchStates) {
            const previous = this.previousTouchStates.get(id);
            if (current && !previous) {
                return true;
            }
        }
        return false;
    }

    isTouchEnded(): boolean {
        for (const [id, current] of this.touchStates) {
            const previous = this.previousTouchStates.get(id);
            if (!current && previous) {
                return true;
            }
        }
        return false;
    }

    getTouchStartPosition(id: number): { x: number; y: number } | null {
        return this.touchStartPositions.get(id) || null;
    }

    getActiveTouchIds(): number[] {
        return Array.from(this.touchStates.entries())
            .filter(([_, state]) => state)
            .map(([id, _]) => id);
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
