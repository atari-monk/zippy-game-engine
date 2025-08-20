import { GameEngine } from "../core/game-engine.js";
import { InputSystem } from "../systems/input/input-system.js";
import { SceneSystem } from "../systems/scene-system.js";

export class GameEngineFactory {
    private gameEngine: GameEngine;

    constructor() {
        this.gameEngine = new GameEngine(
            new InputSystem(),
            new SceneSystem()
        );
    }

    public getGameEngine(): GameEngine {
        return this.gameEngine;
    }
}
