<template>
    <div class="flex flex-col text-center">
        <h1>👋 About</h1>
        <RouterLink to="/" @click="history.push('/')">Home</RouterLink>
    </div>
</template>
<script lang="ts" setup>
import { inject } from 'vue';
import Title from '../components/head/Title.vue';
import { RouterLink } from 'vue-router'
import { useHistory } from '../composable/history';
const history=useHistory();

</script>