<template>
    <section>
        <div>
            <Head v-once/>
        </div>
        <main>
            <RouterView />
        </main>
    </section>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import Head from './Client/components/head/Head.vue'
</script>