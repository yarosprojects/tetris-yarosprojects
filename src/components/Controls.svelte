<script lang="ts">
    import { CONTROLS } from "../consts/properties";
    export let onMove: (dir: string) => void;
</script>

<div class="w-full flex md:hidden justify-center my-2 md:my-5 px-4 py-0 md:py-5" aria-label="Mobile controls">
    <ul
        class="w-full flex flex-row justify-center max-[400px]:flex-wrap items-center gap-5 bg-black/30 py-5 rounded-3xl px-4"
    >
        {#each Object.values(CONTROLS) as control}
            <li>
                <button
                    aria-label={`${control.label} button`}
                    class="flex gap-2 items-center justify-center p-3 rounded-xl shadow-md bg-black text-yellow-400 font-extrabold
                   hover:bg-gray-700 duration-200 active:scale-90 transition-all"
                    on:click={() => onMove(control.id)}
                >
                    <i class="{control.className} text-4xl md:text-xl"></i>
                </button>
            </li>
        {/each}
    </ul>
</div>
