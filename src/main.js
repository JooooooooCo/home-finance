import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "materialize-css/dist/css/materialize.min.css";
import "material-design-icons/iconfont/material-icons.css";
import "./assets/css/appMain.scss";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
