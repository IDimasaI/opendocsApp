<template>
    <div class="flex flex-col text-center">
        <Title v-memo="''">About</Title>
        <h1>👋 About</h1>
        <RouterLink to="/">Home</RouterLink>
    </div>
</template>
<script lang="ts" setup>
import Title from '../components/head/Title.vue';
import { RouterLink } from 'vue-router'
</script>