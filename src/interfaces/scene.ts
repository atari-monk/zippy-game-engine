import type { FrameContext } from 'zippy-shared-lib';

export type Scene = {
    name?: string;
    displayName?: string;
    init?: () => void;
    update?: (deltaTime: number) => void;
    render?: (context: FrameContext) => void;
    onEnter?: () => void;
    onExit?: () => void;
    resize?: () => void;
};
