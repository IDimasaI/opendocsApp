<template>
    <RouterLink :to="to" @click="history.push(to)">
        <slot></slot>
    </RouterLink>
</template>
<script lang="ts" setup>
import { useHistory } from '../composable/history';
import { RouterLink } from 'vue-router';
const { to } = defineProps<{ to: string }>();
const history = useHistory();
</script>