<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import tetrisAudioUrl from '$lib/audio/tetris.mp3';
    import {
        BLOCK_SIZE,
        ROWS,
        COLS,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        TETROMINOS,
        COLORS,
    } from "../consts/properties";
    import type { Piece } from "../types/types";
    import Controls from "./Controls.svelte";
    import Score from "./Score.svelte";

    let audio: HTMLAudioElement;
    let canvas: HTMLCanvasElement;
    let upgradeInfo: HTMLDivElement;
    let ctx: CanvasRenderingContext2D;
    let board: (string | null)[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(null),
    );
    let currentPiece: Piece;
    let gameOver = false;
    let score = 0;
    let level = 0;
    let dropInterval: ReturnType<typeof setInterval>;

    audio = new Audio(tetrisAudioUrl);
    let musicIsPlaying = false;


    // SPAWN A RANDOM PIECE ON BOARD 
    function spawnPiece() {
        const keys = Object.keys(TETROMINOS);
        const rand = keys[Math.floor(Math.random() * keys.length)];
        currentPiece = {
            shape: TETROMINOS[rand],
            color: COLORS[rand],
            x: 3,
            y: 0,
        };
    }

    // DRAW GAME BOARD
    function drawBoard() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const color = board[r][c];
                if (color) drawBlock(c, r, color);
            }
        }
        drawPiece(currentPiece);
    }

    // DRAW BLOCKS
    function drawBlock(x: number, y: number, color: string) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "#222";
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    // DRAW PIECE
    function drawPiece(piece: Piece) {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c])
                    drawBlock(piece.x + c, piece.y + r, piece.color);
            }
        }
    }

    // CHECK COLISION
    function checkCollision(
        piece: Piece,
        dx = 0,
        dy = 0,
        newShape: number[][] | null = null,
    ): boolean {
        const shape = newShape || piece.shape;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const x = piece.x + c + dx;
                    const y = piece.y + r + dy;
                    if (x < 0 || x >= COLS || y >= ROWS) return true;
                    if (y >= 0 && board[y][x]) return true;
                }
            }
        }
        return false;
    }

    // PLACE PIECE ON BOARD
    function placePieceOnBoard(piece: Piece) {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c])
                    board[piece.y + r][piece.x + c] = piece.color;
            }
        }
    }

    // MOVE PIECE
    function movePiece(dx: number, dy: number) {
        if (gameOver) return;
        if (!checkCollision(currentPiece, dx, dy)) {
            currentPiece.x += dx;
            currentPiece.y += dy;
        } else if (dy === 1) {
            placePieceOnBoard(currentPiece);
            clearLines();
            spawnPiece();
            if (checkGameOver()) {
                gameOver = true;
            }
        }
        drawBoard();
    }


    // ROTATE PIECE
    function rotatePiece(piece: Piece) {
        const rows = piece.shape.length;
        const cols = piece.shape[0].length;
        const newShape: number[][] = [];
        for (let c = 0; c < cols; c++) {
            newShape[c] = [];
            for (let r = rows - 1; r >= 0; r--) {
                newShape[c][rows - 1 - r] = piece.shape[r][c];
            }
        }
        if (!checkCollision(piece, 0, 0, newShape)) piece.shape = newShape;
    }

    // CLEAR LINES ON ROW FILL ALL FIGURES
    function clearLines() {
        let linesCleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r].every((cell) => cell)) {
                board.splice(r, 1);
                board.unshift(Array(COLS).fill(null));
                linesCleared++;
                r++;
            }
        }
        if (linesCleared > 0) {
            const pointsPerLines = [0, 40, 100, 300, 1200];
            score += pointsPerLines[linesCleared] * (level + 1);
            updateScoreBoard();
        }
    }

    // MOVE PIECE BY KEYBOARD BUTTON
    function handleKey(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowRight":
                movePiece(1, 0);
                break;
            case "ArrowLeft":
                movePiece(-1, 0);
                break;
            case "ArrowDown":
                movePiece(0, 1);
                break;
            case "ArrowUp":
                rotatePiece(currentPiece);
                drawBoard();
                break;
        }
    }

    // MOBILE CONTROLS
    function onMove(dir: string) {
        switch(dir) {
            case 'left': movePiece(-1, 0); break;
            case 'right': movePiece(1, 0); break;
            case 'down': movePiece(0, 1); break;
            case 'rotate': rotatePiece(currentPiece); drawBoard(); break;
        }
    }

    // CHECK GAME OVER
    function checkGameOver(): boolean {
        return checkCollision(currentPiece);
    }

    // RESTART GAME
    function restartGame() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        gameOver = false;
        score = 0;
        updateScoreBoard();
        spawnPiece();
        drawBoard();
    }


    // UPDATE SCORE
    function updateScoreBoard() {
        const scoreElement = document.getElementById("score");
        const scoreUpgrate = document.getElementById("score-upgrade");
        if (scoreElement) scoreElement.textContent = score.toString();
        if(scoreUpgrate) scoreUpgrate.textContent = score.toString();
        
        upgradeInfo.classList.remove('hidden');
        upgradeInfo.classList.add('animate-fade-in-down');
        setTimeout(function() {
            upgradeInfo.classList.remove('animate-fade-in-down');
            upgradeInfo.classList.add('animate-fade-out-down');
            setTimeout(function() {
                upgradeInfo.classList.add('hidden');
                upgradeInfo.classList.remove('animate-fade-out-down');
                setTimeout(function() {
                    if(scoreUpgrate) scoreUpgrate.textContent = "";
                }, 50);
            }, 600);
        }, 600);
    }

    // TETRIS AUDIO PLAY
    function toggleMusic() {
        if (musicIsPlaying) {
            audio.pause();
            audio.currentTime = 0;
            musicIsPlaying = false;
        } else {
            audio.play();
            musicIsPlaying = true;
        }
    }

    audio.addEventListener('ended', () => {
        musicIsPlaying = false;
    });

    // ON INIT
    onMount(() => {
        ctx = canvas.getContext("2d")!;
        spawnPiece();
        drawBoard();
        window.addEventListener("keydown", handleKey);
        dropInterval = setInterval(() => movePiece(0, 1), 500);
    });

    // ON DESTROY
    onDestroy(() => {
        window.removeEventListener("keydown", handleKey);
        clearInterval(dropInterval);
    });
</script>

{ #if gameOver }
    <div class="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-9999">
        <div class="bg-gray-900 rounded-3xl p-8 flex flex-col items-center shadow-lg animate-fade-in">
            <h1 class="text-white text-4xl font-bold mb-4">Game Over</h1>
            <button
                type="button"
                on:click={restartGame}
                class="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 cursor-pointer active:scale-80 hover:scale-110 transition-all"
            >
                Play Again
            </button>
        </div>
    </div>
{/if }

<div class="relative m-0 p-0 flex flex-col w-full justify-center items-center pt-20 md:pt-0">
    <!-- UPDATE ALERT -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-8000 hidden" bind:this={upgradeInfo} aria-label="Upgrade score text label">
        <span class="text-5xl text-yellow-400 font-bold">
            +<span id="score-upgrade" class="font-extrabold" aria-label="Upgrade amount"></span>
        </span>
    </div>

    <!-- GAME BOARD -->
    <canvas bind:this={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-label="Tetris board" class="max-w-full animate-fade-in-up"></canvas>
</div>

<Score />
<Controls {onMove} />

<div class="w-full flex justify-center items-center px-4 py-5">
    <button 
        type="button" 
        aria-label={musicIsPlaying ? "Stop Music" : "Play Music"}  
        on:click={toggleMusic} 
        class="hover:scale-105 active:scale-85 transition-all cursor-pointer outline-none border-none"
    >
        <div class="flex flex-row justify-center items-center gap-2 px-6 py-3 bg-black rounded-lg">
            <span class="text-base text-white">
                {musicIsPlaying ? "Stop Music" : "Play Music"}
            </span>
            {#if !musicIsPlaying}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 53 58" height="23" width="23" class="text-white/80">
                <path stroke-width="9" stroke="currentColor" d="M44.25 36.3612L17.25 51.9497C11.5833 55.2213 4.5 51.1318 4.50001 44.5885L4.50001 13.4115C4.50001 6.86824 11.5833 2.77868 17.25 6.05033L44.25 21.6388C49.9167 24.9104 49.9167 33.0896 44.25 36.3612Z"></path>
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 53 58" height="23" width="23" class="text-white/80">
                <rect x="10" y="10" width="12" height="38" fill="currentColor"/>
                <rect x="31" y="10" width="12" height="38" fill="currentColor"/>
                </svg>
            {/if}
        </div>
    </button>
</div>
