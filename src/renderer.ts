import { createApp } from 'vue';
import App from './App.vue';
import router from './Client/router';
import { config, initConfig } from './Client/composable/Stores';
import history from './Client/composable/history';
createApp(App)
    .use(router)
    .use(history)
    .provide(config, initConfig('AppConfig', {
        position: "right",
        baseOpen: true,
        Base_operating_mode: "online",
    }))
    .mount(`#app`);
