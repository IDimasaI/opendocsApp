<template>
    <section>
        <Teleport :to="`#${config.position}_side`">
            <Head v-show="show_panel" />
        </Teleport>
        <main>
            <RouterView />
        </main>
    </section>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Head from './Client/components/head/Head.vue'
import { useConfig } from './Client/composable/Stores';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { addListenerHistory_Mouse, useHistory } from './Client/composable/history';
const config = useConfig();
const show_panel = ref(false)
addListenerHistory_Mouse();
onMounted(() => {
    const side = document.getElementById(`${config.value.position}_side`);
    const resizable_panel = document.getElementById('resizable_panel');
    let old_width = resizable_panel.style.width;
    const observer = new MutationObserver(() => {
        if (resizable_panel.style.width !== old_width) {
            old_width = resizable_panel.style.width;
            if (old_width == '100px') {
                show_panel.value = false
            }
        }
    });
    observer.observe(resizable_panel, { attributes: true });
    side.style.height = '100%';
    side.style.minWidth = '10px';
    side.addEventListener('mouseover', () => {
        show_panel.value = true
    })
    onUnmounted(() => {
        side.removeEventListener('mouseover', () => {
            show_panel.value = false
        });
        observer.disconnect();
    })
})
watch(config, () => {
    console.log(config.value);
}, { deep: true })
</script>