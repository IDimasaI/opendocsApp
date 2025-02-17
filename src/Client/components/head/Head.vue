<script lang="ts" setup>
import { createApp, defineComponent } from 'vue';
import head from './_headTemplate.vue'
import router from '../../router';
defineComponent({
    name: 'Head'
})
createApp(head).use(router).mount('#Header_nav');
</script>
<template>
</template>