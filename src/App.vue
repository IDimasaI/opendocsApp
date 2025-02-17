<template>
    <section>
        <header>
            <Head v-once/>
        </header>
        <main>
            <RouterView />
        </main>
    </section>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import Head from './Client/components/head/Head.vue'
</script>