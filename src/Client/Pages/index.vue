<template>
     <div class="flex flex-col text-center">
            <h1>💖 Hello World!</h1>
            <p>Welcome to your Electron application.</p>
            <input v-model="input" class="border border-gray-400 p-2 w-1/2 mx-auto" />
            <button @click="setTitle(input)">Send Data</button>
            <textarea v-model="text" class="border border-gray-400  p-2 w-1/2 mx-auto"></textarea>
            <button @click="createFile('test.txt', text)">Create File</button>
        </div>
</template>
<script lang="ts" setup>

import { ref } from 'vue'
import { createFile, closeWindow, setTitle } from '../electronAPI';
const input = ref('');

const text = ref('');

</script>