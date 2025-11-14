<div class="flex flex-col w-full justify-center items-center py-5 overflow-hidden">
    <h2 class="text-white text-3xl text-center md:text-left md:text-4xl font-extrabold selection:text-black selection:bg-yellow-400">
        <span class="text-white/90">Welcome to Tetris Game created by</span>
        <span class="text-yellow-400 block md:inline">Yaroslav Klymko</span>
    </h2>
</div>

<style>
    div h2 {
        animation: showTitle 1s forwards;
    }

    @keyframes showTitle {
        from {
            opacity: 0;
            transform: translateY(100%);
        } to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>