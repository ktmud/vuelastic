<template>
  <div id="app">
    <header>
      <el-row :gutter="10" v-if="this.$route.name != 'home'">
        <el-col :span="3" :xs="5">
          <router-link to="/" class="site-logo">
            Vuelastic Search
          </router-link>
        </el-col>
        <el-col :span="18">
          <search-form inline icon="search" size="45" />
        </el-col>
      </el-row>
    </header>
    <div class="main">
      <el-row>
        <el-col :span="21" :offset="3" :xs="{offset:0, span:24}">
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
    <footer>
      <div class="container">
        <el-row>
          <el-col :span="21" :offset="3" :xs="{offset:0, span:24}">
            &copy; 2017 <a href="http://github.com/ktmud/vuelastic" target="_blank">Vuelastic Search</a>
                   by <a href="http://github.com/ktmud" target="_blank">ktmud</a>
          </el-col>
        </el-row>
      </div>
    </footer>
  </div>
</template>

<script>
import router from '@/router'

export default {
  name: 'app',
  methods: {
    goHome () {
      router.push('/')
    }
  }
}
</script>

<style lang="sass">
@import "./assets/theme";
</style>
