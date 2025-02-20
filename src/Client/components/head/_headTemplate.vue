<template>
    <div class="grid grid-cols-3 w-full items-center">
        <div id="Header_nav-left" class="no-drag"></div>
        <div class="text-center" id="Header_nav-center">
            <div id="Header_nav-center-content"></div>
        </div>
        <div id="Header_nav-right" class="grid grid-cols-2">
            <div class="w-full" id="rightButtons"></div>
            <div id="separatorButtons"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';


const route = useRoute();
watch(() => route.meta.title, (title: string) => {
    console.log(title, route.params);
    if (title !== document.title) {
        document.title = title //Так-же устанавливает имя приложения
    }
}, { deep: true, immediate: true });
</script>