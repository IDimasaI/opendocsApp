import { createSSRApp } from 'vue';
import App from './App.vue';
import router from './Client/router';
import { config, initConfig } from './Client/composable/Stores';
import history from './Client/composable/history';
createSSRApp(App)
    .use(router)
    .use(history)
    .provide(config, initConfig('AppConfig', {
        position: "right"
    }))
    .mount(`#app`);
