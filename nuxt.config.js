export default {
  target: "static",
  ssr: true,
  components: true,
  /*
   ** Headers of the page
   */
  head: {
    title: "DNAvisualization.org",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "icons/favicon.ico" }],
    htmlAttrs: {
      lang: "en",
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: "~plugins/vue-plotly", mode: "client" }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "nuxt-client-init-module",
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Bootstrap-Vue module configuration
   ** See https://dev.bootstrap-vue.org/docs#nuxtjs-module
   */
  bootstrapVue: {
    componentPlugins: [
      "LayoutPlugin",
      "ModalPlugin",
      "ButtonPlugin",
      "ButtonGroupPlugin",
      "ButtonToolbarPlugin",
      "NavbarPlugin",
      "JumbotronPlugin",
      "FormTextareaPlugin",
      "FormFilePlugin",
      "ImagePlugin",
      "AlertPlugin",
      "TooltipPlugin",
      "FormSelectPlugin",
      "FormInputPlugin",
      "FormGroupPlugin",
      "FormCheckboxPlugin",
      "TabsPlugin",
    ],
    components: [
      "BIconDownload",
      "BIconTrash",
      "BIconGear",
      "BIconFileEarmarkPlus",
      "BIconTextIndentLeft",
      "BIconFileEarmarkText",
    ],
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.alias["plotly.js$"] = "~/plugins/custom-plotly.js"
    },
    babel: {
      compact: true,
    },
  },
}
