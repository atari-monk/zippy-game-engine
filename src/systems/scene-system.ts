import type { Scene } from "../interfaces/scene.js";

export class SceneSystem {
    #currentScene: Scene | undefined;
    #scenes: Map<string, Scene> = new Map();
    #sceneChangeCallbacks: Set<() => void> = new Set();

    registerScene(name: string, sceneModule: Scene): void {
        this.#scenes.set(name, sceneModule);
        sceneModule.init?.();
    }

    transitionToScene(name: string): boolean {
        const scene = this.#scenes.get(name);
        if (!scene) {
            console.error(`Scene ${name} not found`);
            return false;
        }

        this.#currentScene?.onExit?.();
        this.#currentScene = scene;
        this.#currentScene.name = name;
        this.#currentScene.onEnter?.();

        this.#notifySceneChange();
        return true;
    }

    #notifySceneChange(): void {
        this.#sceneChangeCallbacks.forEach((callback) => callback());
    }

    get availableScenes(): Array<{ name: string; displayName: string }> {
        return Array.from(this.#scenes.keys()).map((name) => ({
            name,
            displayName: this.#scenes.get(name)?.displayName || name,
        }));
    }

    get activeScene(): string | undefined {
        return this.#currentScene?.name;
    }

    get currentScene(): Scene | undefined {
        return this.#currentScene;
    }

    onSceneChange(callback: () => void): () => void {
        this.#sceneChangeCallbacks.add(callback);
        return () => this.#sceneChangeCallbacks.delete(callback);
    }
}
