<script>
    const projectsWeb = "https://yarosprojects.dev";
    const frameworkIcon = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg";
</script>

<header class="fixed bg-transparent inset-0 w-full h-(--header-h) px-4 flex justify-between items-center z-9999">
    <a href={projectsWeb} 
        class="flex justify-center items-center px-4 py-2 text-white hover:bg-gray-900/80 bg-gray-900/60 rounded-xl hover:scale-105 transition-all"
        aria-label="My wev of personal projects">
        <i class="icon-[line-md--arrow-left]"></i>
    </a>

    <div class="flex flex-row gap-4 justify-center items-center px-4 py-2">
        <span class="text-white/80 text-sm max-[255px]:hidden">
            Developed in
        </span>
        <img src={frameworkIcon} alt="Angular image" class="size-6">
    </div>
</header>

<style>
    header {
        animation-timeline: scroll();
        animation-range: 0 50px;
        animation: blurHeader .5s linear both;
    }

    @keyframes blurHeader {
        from {
            backdrop-filter: blur(0px);
        } to {
            backdrop-filter: blur(40px);
        }
    }
</style>