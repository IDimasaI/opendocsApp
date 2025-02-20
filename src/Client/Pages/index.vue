<template>
    <section class="flex flex-row gap-4">
            <Title v-memo="''">Главная</Title>
            <div>
                <RouterLink to="/about">О приложении</RouterLink>
            </div>
            <div>
                <RouterLink to="/Docs">Документации</RouterLink>
            </div>
    </section>
</template>
<script lang="ts" setup>
import Title from '../components/head/Title.vue';

</script>