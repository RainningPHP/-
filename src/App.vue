<template>
  <div id="app">
    <router-view />
  </div>
</template>


<script>
  window.baseUrl = 'http://127.0.0.1'
  window.uploadUrl = window.baseUrl + '/app/upload'
  window.downloadUrl = window.baseUrl + '/app/file/forceDownload'
export default  {
  name:  'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    },
}
</script>
