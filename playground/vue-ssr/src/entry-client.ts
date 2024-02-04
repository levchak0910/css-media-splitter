import { createSSRApp } from "vue"

import App from "./App.vue"

const app = createSSRApp(App)

app.mount("#app", true)
