export class KeyboardSystem {
    private keys: Record<string, boolean>;
    private boundKeyDown: (e: KeyboardEvent) => void;
    private boundKeyUp: (e: KeyboardEvent) => void;

    constructor() {
        this.keys = {};
        this.boundKeyDown = this.#handleKeyDown.bind(this);
        this.boundKeyUp = this.#handleKeyUp.bind(this);
        this.#setupEventListeners();
    }

    public isKeyDown(key: string): boolean {
        return this.keys[key] || false;
    }

    public destroy(): void {
        window.removeEventListener("keydown", this.boundKeyDown);
        window.removeEventListener("keyup", this.boundKeyUp);
    }

    #setupEventListeners(): void {
        window.addEventListener("keydown", this.boundKeyDown);
        window.addEventListener("keyup", this.boundKeyUp);
    }

    #handleKeyDown(e: KeyboardEvent): void {
        this.keys[e.key] = true;
        if (
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
                e.key
            )
        ) {
            e.preventDefault(); // Prevent scrolling for arrow keys/space
        }
    }

    #handleKeyUp(e: KeyboardEvent): void {
        this.keys[e.key] = false;
    }
}
