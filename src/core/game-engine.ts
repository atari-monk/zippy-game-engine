import type { FrameContext, EngineHook } from "zippy-shared-lib";
import type { Scene } from "../type/scene.js";
import { SceneSystem, type SceneSystemMode } from "../system/scene-system.js";
import type { InputSystem } from "../input-system/input-system.js";

export class GameEngine implements EngineHook {
    debugMode: boolean = false;
    private sceneMode: SceneSystemMode = "current";

    constructor(
        private readonly inputSystem: InputSystem,
        private readonly sceneSystem: SceneSystem
    ) {}

    handleDebugToggle(): void {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? "ON" : "OFF"}`);
    }

    toggleSceneMode(): void {
        this.sceneMode = this.sceneMode === "current" ? "all" : "current";
        this.sceneSystem.setMode(this.sceneMode);
        if (this.debugMode)
            console.log(`Scene mode: ${this.sceneMode.toUpperCase()}`);
    }

    setSceneMode(mode: SceneSystemMode): void {
        this.sceneMode = mode;
        this.sceneSystem.setMode(mode);
        if (this.debugMode)
            console.log(`Scene mode set to: ${mode.toUpperCase()}`);
    }

    getSceneMode(): SceneSystemMode {
        return this.sceneMode;
    }

    frameTick = (context: FrameContext): void => {
        this.inputSystem.update();
        //this.sceneSystem.currentScene?.update?.(context);
        //this.sceneSystem.currentScene?.render?.(context);
        if (this.sceneMode === "current") {
            this.sceneSystem.currentScene?.update?.(context);
            this.sceneSystem.currentScene?.render?.(context);
        } else {
            this.sceneSystem.updateAllScenes(context);
            this.sceneSystem.renderAllScenes(context);
        }
    };

    get availableScenes() {
        return this.sceneSystem.availableScenes;
    }

    get activeScene() {
        return this.sceneSystem.activeScene;
    }

    get input(): InputSystem {
        return this.inputSystem;
    }

    onSceneChange(callback: () => void): () => void {
        return this.sceneSystem.onSceneChange(callback);
    }

    transitionToScene(name: string): boolean {
        return this.sceneSystem.transitionToScene(name);
    }

    registerScene(name: string, sceneModule: Scene): void {
        this.sceneSystem.registerScene(name, sceneModule);
    }
}
