<template>
    <div class="flex flex-row text-left" style="min-height: 100vh;">
        <div>
            <Teleport defer to="#outer-content">
                <button @click="getManifestDocsInApi">Open Folder</button>
            </Teleport>
        </div>
        <div class="flex flex-col items-start w-64">
            <template v-if="files" v-for="group in Object.keys(files)" :key="group">
                <h4 class="text-lg" style="user-select: none;">{{ group }}</h4>
                <template v-for="file in files[group]" :key="file.title">
                    <RouterLink :to="file.url" class="w-full text-left" @click="getDocsInApi(file.url); history.push(file.url)">{{
                        file.title }}</RouterLink>
                    <template v-if="file.sub_docs" v-for="sub_doc in file.sub_docs" :key="sub_doc.title">
                        <RouterLink :to="sub_doc.url" class="w-full text-left" @click="getDocsInApi(sub_doc.url); history.push(sub_doc.url)">{{ sub_doc.title }}</RouterLink>
                    </template>
                </template>
            </template>
        </div>
        <section class="bg-gray-600 text-white">
            <div v-html="openedFile.data" id="Docs_panel"></div>
        </section>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import MarkdownParser from '../utils/MarkdownParser';
import '../../assets/css/Doc.css'
import { useStatusBar } from '../utils/status_bar_content';
import { useHistory } from '../composable/history';
import { LocalStorage } from '../utils/localStorage';
const parser = new MarkdownParser({
    tags: {},
    sanitize: true
});
const files = ref<{ [key: string]: { title: string, url: string, tag: string, sub_docs?: Doc[] }[] }>({});
const openedFile = ref({ data: '', name: '' });
const route = useRoute();
const history = useHistory();

const CurrentPath = ref(route.path);
const CurrentHistoryPath = history.getCurrent();




watch(CurrentHistoryPath, (path: string) => {
    getDocsInApi(path);
}, {deep: true});

onMounted(async () => {
    getDocsInApi(route.path, true);
    useStatusBar([openedFile], 'Docs_panel');
});

const getManifestDocsInApi = async (): Promise<void> => {
    if (Object.keys(files.value).length > 0) return;
    if (LocalStorage.Expired.get('docs') !== null) {
        files.value = JSON.parse(LocalStorage.Expired.get('docs'));
    } else {
        const res = await fetch(`http://doc/api/docs?get=manifest`, { method: 'GET' });
        const data: { title: string, url: string, tag: string }[] = await res.json();
        files.value = group_docs(data, '/Docs');
        LocalStorage.Expired.set('docs', JSON.stringify(files.value), 1000 * 60 * 60 * 24);// 1 day
    }
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
    if (firstLoad && Object.keys(files.value).length == 0) {
        getManifestDocsInApi();
    }
}
type Doc = {
    title: string;
    url: string;
    tag: string;
}
/**
 * 
 * @param objects Набор обьектов из индексового массива
 * @param baseURL базый url к примеру `/Docs`
 * @returns сгруппированные обьекты с суб документами
 */
const subDocs = (objects: Doc[], baseURL?: string) => {
    const sortedObjects = objects.sort((a, b) => {
        const aHasDash = a.url.includes('-');
        const bHasDash = b.url.includes('-');
        if (aHasDash && !bHasDash) return 1;
        if (!aHasDash && bHasDash) return -1;

        if (a.tag === '' && b.tag !== '') return -1;
        if (a.tag !== '' && b.tag === '') return 1;

        return 0;
    });

    let grouped: any = {};

    sortedObjects.forEach((obj) => {
        const [path, id] = obj.url.split('-');
        if (id !== undefined) {
            if (!grouped[path]) {
                grouped[path] = {
                    title: obj.title,
                    url: path,
                    tag: obj.tag
                };
            }
            if (!grouped[path].sub_docs) {
                grouped[path].sub_docs = {};
            }
            grouped[path].sub_docs[id] = {
                title: obj.title,
                url: obj.url
            };
        } else {
            if (!grouped[obj.url]) {
                grouped[obj.url] = {
                    title: obj.title,
                    url: obj.url,
                    tag: obj.tag
                }
            }
        }
    });

    return grouped;
};

/**
 * 
 * @param object Набор обьектов из индексового массива
 * @param baseURL  базый url к примеру `/Docs`
 * @returns Сгруппированные обьекты в обьекты в формате `{tag: {key: {title: string, url: string}}}`
 * @description Возвращает сгруппированные обьекты в обьекты в формате `{tag: {key: {title: string, url: string}}}`.
 * Если `tag` не определен, то `tag` будет пустой строкой. И будет переведен в самый верхний уровень
 */
const group_docs = (objects: Doc[], baseURL?: string) => {
    const grouped = subDocs(objects, baseURL);
    const groupedByTag: Record<string, any> = {};

    for (const key of Object.keys(grouped)) {
        const tag = grouped[key].tag || '';
        if (!groupedByTag[tag]) {
            groupedByTag[tag] = {};
        }
        groupedByTag[tag][key] = grouped[key];
    }

    console.log(groupedByTag);
    return groupedByTag;
};




</script>