<template>
    <section>
        <Teleport to=".titlebar">
            <div class="grid grid-cols-3 w-full ">
                <button>1</button>
                <p class="text-center">Текст</p>
                <button @click="closeWindow"
                    class=" absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    style="app-region: no-drag">X</button>
            </div>
        </Teleport>
        <main>
            <RouterView />
        </main>
        <div>
            <RouterLink to="/about">About</RouterLink>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { createFile, closeWindow, setTitle } from './Client/electronAPI';
const input = ref('');

const text = ref('');

</script>