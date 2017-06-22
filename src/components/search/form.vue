<template>
  <el-form :inline="inline" action="/search" class="search-form">
    <el-input v-model="q" @keydown.enter.native="submit" :on-icon-click="submit"
      required
      :size="size" :icon="icon" :placeholder="placeholder"></el-input>
    <slot></slot>
  </el-form>
</template>

<script>
import router from '@/router'

export default {
  name: 'search-form',
  props: ['inline', 'placeholder', 'size', 'icon'],
  data () {
    return {
      q: this.$route.query.q
    }
  },
  methods: {
    submit (event) {
      event.preventDefault()
      router.push({
        name: 'search',
        query: {
          q: this.q
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
