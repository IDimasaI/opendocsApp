<template>
    <div class="flex flex-row text-left" style="min-height: 100vh;">
        <div>
            <Teleport defer to="#outer-content">

            </Teleport>
        </div>
        <div class="w-64">
            <template v-if="files" v-for="group in Object.keys(files)" :key="group">
                <h3 v-if="group !== ''" class="text-white text-sm font-medium border-b border-gray-500 p-1"
                    style="user-select: none;">{{ group }}</h3>
                <template v-for="file in files[group]" :key="file">
                    <ul className="list-none text-white text-sm font-medium contents">
                        <RouterLink :to="file.url"
                            :class="`flex items-center ${focus(`${file.url}`)}`">
                            <span v-if="file?.subDocs?.length" className="h-4 w-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                    viewBox="0 0 24 24" stroke="white">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        :d="`${CurrentPath.startsWith(file.url) ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}`">
                                    </path>
                                </svg>
                            </span>
                            {{ file.title }}
                        </RouterLink>
                        <details class=" border-l-8 border-gray-500" v-if="file?.subDocs?.length"
                            :open="CurrentPath.startsWith(file.url)">
                            <summary className="list-none none"></summary>
                            <ul className="grid grid-cols-1">
                                <template v-for="subDocs in file?.subDocs">
                                    <li class="list-none text-white text-sm font-medium contents">
                                        <RouterLink :to="subDocs.url"
                                            :class="focus(subDocs.url)">
                                            {{ subDocs.title }}
                                        </RouterLink>
                                    </li>
                                </template>
                            </ul>
                        </details>
                    </ul>
                </template>
            </template>
        </div>
        <section class="bg-gray-600 text-white w-full" @click="handleClick">
            <div v-html="openedFile.data" id="Docs_panel"></div>
        </section>
    </div>
</template>
<script lang="ts" setup>
import RouterLink from '../components/RouterLink.vue';
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import MarkdownParser from '../utils/MarkdownParser';
import '../../assets/css/Doc.css'
import { useStatusBar } from '../utils/status_bar_content';
import { useHistory } from '../composable/history';
import { LocalStorage } from '../utils/localStorage';
import { GetDocs, GetManifest, OpenExternalUrl } from '../electronAPI';
import isEqual from '../utils/isEqual';
import { useNetworkStatus } from '../composable/hooks';

const parser = new MarkdownParser({
    tags: {},
    sanitize: true
});
const files = ref<{ [key: string]: { title: string, url: string, tag: string, subDocs?: Doc[] }[] }>({});
const openedFile = ref({ data: '', name: '' });
const route = useRoute();
const history = useHistory();

const CurrentPath = ref(route.path);
const CurrentHistoryPath = history.getCurrent();

const { isOnline } = useNetworkStatus();

const focus = computed(() => (key: string) => {
    return CurrentPath.value == key ? 'bg-blue-300/50 p-1 sm:rounded-r-full' : 'p-1 hover:bg-gray-300/50 sm:hover:rounded-r-full'
})

watch(CurrentHistoryPath, async (path: string) => {
    await getDocsInApi(path);
}, { deep: true });

onMounted(async () => {
    getDocsInApi(route.path, true);
    useStatusBar([openedFile], 'Docs_panel');
});

const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && target.tagName === 'A') {
        event.preventDefault();
        if (target.href.startsWith('https')) {
            OpenExternalUrl(target.href);
            return;
        }
        let url = new URL(target.href).pathname;
        if (!url.startsWith('/Docs')) {
            url = `/Docs${url}`;
        }
        return history.push(url);
    }
}

const getManifestDocsInApi = async (): Promise<void> => {
    if (Object.keys(files.value).length > 0) return;
    const manifest = LocalStorage.Expired.get('manifest');
    if (manifest !== null) {
        files.value = JSON.parse(manifest);
    } else {
        const data: { title: string, url: string, tag: string }[] = await GetManifest();
        console.log(data);
        files.value = group_docs(data, '/Docs');
        if (isEqual(JSON.parse(manifest), JSON.parse(JSON.stringify(files.value)))) {
            LocalStorage.Expired.updateTimestamp('manifest');
        } else {
            LocalStorage.Expired.set('manifest', JSON.stringify(files.value), 1000 * 60 * 60 * 24);// 1 day
        }
    }
}
const cacheDocs = new Map();
const getDocsInApi = async (path?: string, firstLoad?: boolean) => {
    const CacheExpired = 1000 * 60 * 60 * 24;// 1 day
    if (CurrentPath.value === path && !firstLoad) return;
    if (path == '/Docs') return getManifestDocsInApi();

    if (cacheDocs.has(path)) {
        const cache = JSON.parse(cacheDocs.get(path));
        if (cache.expired > Date.now()) {
            const { data, name } = cache;
            openedFile.value = { data, name };
            CurrentPath.value = path;
        } else {
            cacheDocs.delete(path);
            return getDocsInApi(path, firstLoad);
        }
    } else {
        const data = await GetDocs(path, isOnline.value);
        openedFile.value.data = parser.parse(data);
        openedFile.value.name = path.split('/').pop();
        CurrentPath.value = path;
        cacheDocs.set(path, JSON.stringify({ data: openedFile.value.data, name: openedFile.value.name, expired: Date.now() + CacheExpired }));// 1 hour
    }

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
 * @param object Набор обьектов из индексового массива
 * @param baseURL  базый url к примеру `/Docs`
 * @returns Сгруппированные обьекты в обьекты в формате `{tag: {key: {title: string, url: string}}}`
 * @description Возвращает сгруппированные обьекты в обьекты в формате `{tag: {key: {title: string, url: string}}}`.
 * Если `tag` не определен, то `tag` будет пустой строкой. И будет переведен в самый верхний уровень
 */
const group_docs = (objects: Doc[], baseURL?: string): Record<string, any> => {
    const grouped = objects
    const groupedByTag: Record<string, any> = {};

    for (const key in Object.keys(grouped)) {
        const doc = grouped[key];
        if (!groupedByTag[doc.tag]) {
            groupedByTag[doc.tag] = {};
        }
        groupedByTag[doc.tag][doc.url] = doc;
    }

    console.log(groupedByTag);
    return groupedByTag;
};




</script>