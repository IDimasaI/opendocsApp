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
import { RouterView } from 'vue-router'
import Head from './Client/components/head/Head.vue'
import { useConfig } from './Client/composable/Stores';
import { onMounted, onUnmounted, ref } from 'vue';
import { addListenerHistory_Mouse, } from './Client/composable/history';
const config = useConfig();

const show_panel = ref(config.value.baseOpen);
addListenerHistory_Mouse();
const heandlerPanel = () => {
    if (show_panel.value == true) return
    const center = document.getElementById('app');
    center.style.width = 'calc(100% - 100px)';
    show_panel.value = true
}
onMounted(() => {
    const side = document.getElementById(`${config.value.position}_side`);
    const resizable_panel = document.getElementById('resizable_panel');
    const center = document.getElementById('app');
    let old_width = resizable_panel.style.width;
    center.style.width = `calc(100% - ${old_width})`;
    const observer = new MutationObserver(() => {
        if (resizable_panel.style.width !== old_width) {
            old_width = resizable_panel.style.width;
            if (old_width == '100px' && show_panel.value == true) {
                show_panel.value = false
                center.style.width = 'calc(100% - 0px)';
            } else {
                center.style.width = `calc(100% - ${old_width})`;
            }
        }
    });

    observer.observe(resizable_panel, { attributes: true });
    side.style.height = '100%';
    side.style.minWidth = '10px';
    side.classList.add('no-drag');
    side.addEventListener('mouseover', heandlerPanel)
    onUnmounted(() => {
        side.removeEventListener('mouseover', heandlerPanel);
        observer.disconnect();
    })
})
</script>