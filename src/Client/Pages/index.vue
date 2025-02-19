<template>
    <div class="flex flex-row text-left">
        <Teleport to="#Header_nav-right" defer>
            <button @click="Dir()">Открыть папку</button>
        </Teleport>
        <Teleport to="#Header_nav-title" defer v-memo="[route.meta.title]">
            {{ route.meta.title }}
        </Teleport>
        <div class="flex flex-col items-start w-64">
            <template v-for="file in files">
                <button @click="openFile(file, path)">{{ file }}</button>
            </template>
        </div>
        <section>
            <div v-html="openedFile" id="Docs_panel"></div>
        </section>
        <div>
            <RouterLink to="/about">About</RouterLink>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import { OpenFolder_Dialog } from '../electronAPI';
import { useRoute } from 'vue-router';
import MarkdownParser from '../utils/MarkdownParser';
import '../../assets/css/Doc.css'
import { useStatusBar } from '../utils/status_bar_content';
const parser = new MarkdownParser({
    tags: {},
    sanitize: true
});
const files = ref([])
const path = ref('')
const openedFile = ref('');
const route = useRoute();

const test = ref(1)


onMounted(async () => {
    useStatusBar([openedFile], 'Docs_panel');
});

const Dir = async () => {
    const dir = await OpenFolder_Dialog()
    files.value = dir.dir
    route.meta.title = dir.path
    document.title = dir.path.split('/').pop()
    path.value = dir.path
    console.log(dir);
};

const openFile = async (file: string, path: any) => {
    const text = await window.electronAPI.OpenExternalFile(file, path);
    openedFile.value = parser.parse(text);
};

</script>