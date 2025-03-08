<template>
  <div>
    <ResizablePanel>
      <section id="top">
        <div class="no-drag text-center flex flex-col gap-2">
          <div style="height: 32px; width: 100%; max-width: 119px; align-self: end;"
            class="grid grid-cols-3 gap-4 justify-items-center buttonsContainer">
            <button @click="hideWindow" class="hover:bg-zinc-700 w-8 rounded-md">
              <svg width="16" height="16" style="margin: auto;" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <line x1="2" y1="12.5" x2="14" y2="12.5" stroke="white" />
              </svg>
            </button>
            <button @click="maximizeUnmaximizeWindow" class="hover:bg-zinc-700 w-8 rounded-md">
              <svg width="16" height="16" style="margin: auto;" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect x="3.5" y="3.5" width="9" height="9" stroke="white" />
              </svg>
            </button>
            <button @click="closeWindow" class="hover:bg-red-700 w-8 rounded-md">
              <svg width="16" height="16" style="margin: auto;" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <line x1="1.66214" y1="13.6314" x2="13.6621" y2="2.63142" stroke="white" />
                <line y1="-0.5" x2="16.2788" y2="-0.5" transform="matrix(-0.737154 -0.675725 -0.675725 0.737154 14 14)"
                  stroke="white" />
              </svg>
            </button>
          </div>
          <p class="bg-gray-500 max-w-md w-full mx-auto rounded-md border border-black"
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="`${history.getCurrent().value}`">
            {{ history.getCurrent() }}</p>
          <section id="adds_tabs" class="flex flex-col gap-2">
            <h4 class="text-lg cursor-pointer" style="user-select: none;" @click="open_tabs = !open_tabs">Вкладки</h4>
            <Transition>
              <div v-if="open_tabs" style="border-bottom: 1px solid white;">
                <div>
                  <button @click="addTabs()">Добавить вкладку</button>
                </div>
                <div class="flex flex-col gap-2" style="max-height: 210px; overflow-y: auto;">
                  <template v-for="tab in tabs" :key="tab.name">
                    <RouterLink :to="tab.url" @click="history.push(tab.url)">{{ tab.name }}</RouterLink>
                  </template>
                </div>
              </div>
            </Transition>
          </section>
          <div class="flex flex-col gap-2" id="outer-content">
            <!--Не менять! Это на новый год(для <Teleport> тегов)-->
          </div>
          <Transition>
            <section id="open_settings" v-if="open_settings.open" class="gap-2 flex flex-col">
              <h4 class="text-lg cursor-pointer" style="user-select: none;"
                @click="open_settings.current !== '' ? open_settings.current = '' : open_settings.current = 'panel'">
                Настройки панели
              </h4>
              <TransitionGroup>
                <div v-if="open_settings.current == 'panel'" class="flex flex-col gap-2">
                  <button @click="config.position == 'left' ? config.position = 'right' : config.position = 'left'">
                    Поменять положение(DEV)
                  </button>
                  <button @click="config.baseOpen = !config.baseOpen">
                    Начальное состояние: {{ config.baseOpen ? 'открыто' : 'закрыто' }}
                  </button>
                  <button
                    @click="config.Base_operating_mode = config.Base_operating_mode == 'online' ? 'offline' : 'online'">
                    Режим работы: {{ config.Base_operating_mode == 'online' ? 'Онлайн' : 'Офлайн' }}
                  </button>
                </div>
              </TransitionGroup>
            </section>
          </Transition>
        </div>
      </section>
      <section id="bottom">
        <div class="no-drag justify-items-center grid grid-cols-3 gap-2 mb-2 mx-auto" style="max-width: 300px;">
          <button @click="isOnline ? OpenExternalUrl('http://doc/') : null">
            <component :is="isOnline ? NetworkOnline : NetworkOffline" />
          </button>
          <button @click="open_settings.open = !open_settings.open" id="settings"
            :style="{ transform: `rotate(${open_settings.open ? 90 : 0}deg)`, transition: 'transform 0.3s ease-in-out' }">
            <Settings />
          </button>
          <div>d</div>
        </div>
      </section>
    </ResizablePanel>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, Transition, TransitionGroup } from 'vue';
import { useRouter } from 'vue-router';
import Settings from '../../../assets/svg/settings.vue';
import NetworkOffline from '../../../assets/svg/networkOffline.vue';
import NetworkOnline from '../../../assets/svg/networkOnline.vue';
import ResizablePanel from '../ResizablePanel.vue';
import { useConfig } from '../../composable/Stores';
import { closeWindow, maximizeUnmaximizeWindow, hideWindow, OpenExternalUrl } from '../../electronAPI';
import './../../../assets/css/TitleBar.css'
import { useHistory } from '../../composable/history';
import { useNetworkStatus } from '../../composable/hooks';
import { LocalStorage } from '../../utils/localStorage';
const config = useConfig();
const history = useHistory();
const open_settings = ref({
  open: false,
  current: ''
});
const open_tabs = ref(false);
const { isOnline } = useNetworkStatus();
const router = useRouter();

const tabs = ref<{ name: string, url: string }[]>(LocalStorage.get<{ name: string, url: string }[]>('tabs') || []);
const addTabs = () => {
  const tab = { name: router.currentRoute.value.meta.title !== '' ? router.currentRoute.value.meta.title : history.getCurrent().value.split('/').pop(), url: history.getCurrent().value };
  tabs.value.push(tab);
  console.log(tabs.value);
  LocalStorage.push('tabs', tab);
}

</script>