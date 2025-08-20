import type { FrameContext, EngineHook } from "zippy-shared-lib";
import type { Scene } from "../interfaces/scene.js";
import { SceneSystem } from "../systems/scene-system.js";
import type { InputSystem } from "../systems/input/input-system.js";

export class GameEngine implements EngineHook {
    debugMode: boolean = true;

    constructor(
        private readonly inputSystem: InputSystem,
        private readonly sceneSystem: SceneSystem
    ) {}

    handleDebugToggle(): void {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? "ON" : "OFF"}`);
    }

    frameTick = (context: FrameContext): void => {
        this.inputSystem.update();
        this.sceneSystem.currentScene?.update?.(context.deltaTime);
        this.sceneSystem.currentScene?.render?.(context);
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
