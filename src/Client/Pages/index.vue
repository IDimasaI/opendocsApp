<script lang="ts" setup>
import { inject } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useHistory } from '../composable/history';
const route = useRouter();
const history = useHistory();
</script>
<template>
    <section class="flex flex-row gap-4" id="1">
        <div>
            <RouterLink to="/about" @click="history.push('/about')">О приложении</RouterLink>
        </div>
        <div>
            <RouterLink to="/Docs" @click="history.push('/Docs')">Документации</RouterLink>
        </div>
    </section>
</template>
