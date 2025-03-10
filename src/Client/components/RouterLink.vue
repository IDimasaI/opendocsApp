<template>
    <RouterLink :to="to" @click="no_push ? history.no_push(to) : history.push(to)">
        <slot></slot>
    </RouterLink>
</template>
<script lang="ts" setup>
import { useHistory } from '../composable/history';
import { RouterLink } from 'vue-router';
const { to, no_push } = defineProps<{ to: string, no_push?: boolean }>();

const history = useHistory();
</script>