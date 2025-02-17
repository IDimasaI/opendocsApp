<template>
    <div class="grid grid-cols-3 w-full">
        <div id="Header_nav-right" class="no-drag"></div>
        <p class="text-center" id="Header_nav-title"></p>
        <button @click="closeWindow()"
            class=" absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style="app-region: no-drag">X</button>
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { closeWindow } from '../../electronAPI';
import { ref, watch } from 'vue';
const title_head = ref('');

const route = useRoute();
watch(() => route.meta.title, (title: string) => {
    console.log(title);
    if (title) {
        title_head.value = title
        document.title = title //Так-же устанавливает имя приложения
    }
}, { deep: true, immediate: true });
</script>