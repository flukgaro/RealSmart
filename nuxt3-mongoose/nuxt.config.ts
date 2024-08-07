// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  runtimeConfig:{

     mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/RM'
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
