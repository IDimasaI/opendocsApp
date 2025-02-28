<template>
    <div class="flex flex-row text-left" style="min-height: 100vh;">
        <Teleport to="#outer-content" :defer="true">
            <div>
                <button @click="getManifestDocsInApi">Open Folder</button>
            </div>
        </Teleport>
        <div class="flex flex-col items-start w-64">
            <template v-for="file in files">
                <button @click="getDocsInApi(file.url)" :style="`${CurrentPath === file.url ? 'color: red' : ''}`">{{
                    file.title }}</button>
            </template>
        </div>
        <section class="bg-gray-600">
            <div  v-html="openedFile.data" id="Docs_panel"></div>
        </section>
    </div>
</template>
<script lang="ts" setup>
import {  onMounted, onUnmounted, onUpdated, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import MarkdownParser from '../utils/MarkdownParser';
import '../../assets/css/Doc.css'
import { useStatusBar } from '../utils/status_bar_content';

import { addListenerHistory_Mouse } from '../composable/history';
const parser = new MarkdownParser({
    tags: {},
    sanitize: true
});
const files = ref([])
const openedFile = ref({ data: '', name: '' });
const route = useRoute();
const router = useRouter();
const CurrentPath = ref(route.path);

onMounted(async () => {
    useStatusBar([openedFile], 'Docs_panel');
});

const getManifestDocsInApi = async () => {
    const res = await fetch(`http://doc/api/docs?get=manifest`, { method: 'GET' });
    const data: { title: string, url: string, tag: string }[] = await res.json();
    console.log(data);
    files.value = data;

}
const getDocsInApi = async (path?: string, firstLoad?: boolean) => {
    if (CurrentPath.value === path && !firstLoad) return;
    const res = await fetch(`http://doc/api/docs?data=${path}`, { method: 'GET' });
    const data = await res.text();
    openedFile.value.data = parser.parse(data);
    openedFile.value.name = path.split('/').pop();
    console.log(openedFile.value);
    CurrentPath.value = path;


    if (document.title !== `Docs - ${openedFile.value.name}`) document.title = `Docs - ${openedFile.value.name}`
}






</script>