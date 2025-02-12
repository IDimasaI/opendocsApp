<script setup lang="ts">
import { computed, useSlots } from 'vue';
const slots = useSlots() as any
document.title = computed(() => slots.default()[0].children).value
</script>

<template></template>