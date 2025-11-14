export const BLOCK_SIZE = 30;
export const COLS = 10;
export const ROWS = 20;
export const CANVAS_WIDTH = COLS * BLOCK_SIZE;
export const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

export const CONTROLS = {
    left: { id: 'left', label: 'Left', className: 'icon-[line-md--arrow-left]' },
    right: { id: 'right', label: 'Right', className: 'icon-[line-md--arrow-right]' },
    spin: { id: 'rotate', label: 'Rotate', className: 'icon-[streamline-flex--line-arrow-rotate-left-2-remix]' },
    down: { id: 'down', label: 'Down', className: 'icon-[line-md--arrow-down]' },
};

export const TETROMINOS: Record<string, number[][]> = {
    I: [[1,1,1,1]],
    J: [[1,0,0],[1,1,1]],
    L: [[0,0,1],[1,1,1]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0]],
    T: [[0,1,0],[1,1,1]],
    Z: [[1,1,0],[0,1,1]]
};

export const COLORS: Record<string, string> = {
    I: "cyan",
    J: "blue",
    L: "orange",
    O: "yellow",
    S: "green",
    T: "purple",
    Z: "red"
};
