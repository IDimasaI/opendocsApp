<script lang="ts" setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { useHistory } from '../composable/history';
import RouterLink from '../components/RouterLink.vue';
import { OpenExternalUrl } from '../electronAPI';
import '../../assets/css/Doc.css';
const route = useRouter();
const history = useHistory();

</script>
<template>
    <main class="bg-gradient-to-b from-indigo-900 via-[#300171] to-gray-900 min-h-screen" id='main_js_content'>
        <div class="my_bg min-h-screen">
            <div class="pt-24 flex flex-col gap-48 ">
                <section id="into">
                    <div class="leading-normal text-center text-white text-4xl font-bold w-3/4 mx-auto pb-8">
                        <h1 class="text-6xl">OpenCods</h1>
                        <p>Библиотека компонентов/модулей для создания сайтов с минимальными усилиями, и максимальной
                            скоростью.</p>
                        <div class="flex max-lg:flex-col items-center justify-center text-white py-2 pt-8 gap-4">
                            <RouterLink to="/Docs"
                                class="text-lg text-gray-700 bg-gray-100 hover:bg-gray-300 hover:text-white hover:shadow-lg  px-2 py-1 rounded-md font-bold w-60 flex justify-center items-center">
                                Документация
                            </RouterLink>
                            <button
                                class="text-lg text-gray-700 bg-gray-100 hover:bg-gray-300 hover:text-white hover:shadow-lg  px-2 py-1 rounded-md font-bold w-60 flex justify-center items-center">Примеры</button>
                            <button @click="OpenExternalUrl('https://github.com/IDimasaI/opendocsApp')"
                                class="text-lg text-gray-700 bg-gray-100 hover:bg-gray-300 hover:text-white hover:shadow-lg  px-2 py-1 rounded-md font-bold w-60 flex justify-center items-center gap-1">GitHub
                                <svg class="w-4 h-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                    id="github-icon">
                                    <path
                                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>
                <section id="Why">
                    <div class="mx-auto text-white w-10/12">
                        <h4 class="text-2xl text-ellipsis text-center">Краткая Информация</h4>
                        <div class="grid md:grid-cols-2 gap-8">
                            <div class="pt-8">
                                <p>Данная библиотека нацеленна на Web-разработку, однако, здесь вы можете найти и
                                    CLI-программы, и другие инструменты.</p>
                                <p>На данный момент OpenCods работает с языками: PHP, JavaScript</p>
                                <p>А также с некотороми фреймворками: React</p>
                                <p>Список языков и фреймворков может расширяться в дальнейшем.</p>
                            </div>
                            <div class="pt-8">
                                <p>Основная разработка ведется с нуля. Из-за чего некоторые компоненты быстрее
                                    аналогов других фреймворков.</p>
                                <p>Разработка OpenCods в большинстве случаев происходит на PHP.</p>
                                <p>Главная цель - создать легковестный и самодостаточный PHP фреймворк с нуля, чтобы
                                    его можно было использовать в любом проекте, и с высокой скоростью.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="Examples">

                </section>
            </div>
        </div>
    </main>
</template>
