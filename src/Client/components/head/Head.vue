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
          <p class="bg-gray-500 max-w-md w-full mx-auto rounded-md border border-black" style="min-width: fit-content;"
            :title="`${history.getCurrent().value}`">
            {{ history.getCurrent() }}</p>
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
                </div>
              </TransitionGroup>
            </section>
          </Transition>
        </div>
      </section>
      <section id="bottom">
        <div class="no-drag text-center">
          <button @click="open_settings.open = !open_settings.open" id="settings"
            :style="{ transform: `rotate(${open_settings.open ? 90 : 0}deg)`, transition: 'transform 0.3s ease-in-out' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </section>
    </ResizablePanel>
  </div>
</template>
<script lang="ts" setup>
import { ref, Transition, TransitionGroup } from 'vue';
import ResizablePanel from '../ResizablePanel.vue';
import { useConfig } from '../../composable/Stores';
import { closeWindow, maximizeUnmaximizeWindow, hideWindow } from '../../electronAPI';
import './../../../assets/css/TitleBar.css'
import { useHistory } from '../../composable/history';
const config = useConfig();
const history = useHistory();
const open_settings = ref({
  open: false,
  current: ''
});
console.log(config);


</script>