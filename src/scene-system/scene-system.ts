import type { FrameContext } from "zippy-shared-lib";
import type { Scene } from "./scene.js";
import type { SceneSystemMode } from "./scene-system-mode.js";

export class SceneSystem {
    #currentScene: Scene | undefined;
    #scenes: Map<string, Scene> = new Map();
    #sceneChangeCallbacks: Set<() => void> = new Set();
    #mode: SceneSystemMode = "current";

    setMode(mode: SceneSystemMode): void {
        this.#mode = mode;
    }

    getMode(): SceneSystemMode {
        return this.#mode;
    }

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

    updateAllScenes(context: FrameContext): void {
        for (const scene of this.#scenes.values()) {
            scene.update?.(context);
        }
    }

    renderAllScenes(context: FrameContext): void {
        for (const scene of this.#scenes.values()) {
            scene.render?.(context);
        }
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

    getAllScenes(): Scene[] {
        return Array.from(this.#scenes.values());
    }

    onSceneChange(callback: () => void): () => void {
        this.#sceneChangeCallbacks.add(callback);
        return () => this.#sceneChangeCallbacks.delete(callback);
    }
}
