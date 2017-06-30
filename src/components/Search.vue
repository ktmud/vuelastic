<template>
  <div class="search-results" v-loading="loading">
    <el-row>
      <el-col :span="21" :offset="3" :xs="{offset:0, span:24}">
        <div class="container results" v-if="!loading">
          <p class="no-results" v-if="!hasQuery">
            What do you want to search today?
          </p>
          <p class="no-results" v-if="hasQuery && !hasResults">
            Nothing Found. :(
          </p>
          <el-alert type="error" v-if="error" show-icon
            :title="error.title"
            :description="error.description"
            ></el-alert>
          <div class="results" v-if="hasResults">
            <p class="results-count text-sm">
              {{ start + 1 }} to {{ end }} of {{ meta.total }} results ({{ meta.took }} seconds)
            </p>
            <search-results :query="query" :items="hits"></search-results>
            <!-- elastic search only allow -->
            <el-pagination layout="prev, pager, next"
              :total="totalMax"
              :page-size="size"
              :current-page.sync="currentPage"
              @current-change="gotoPage"
              ></el-pagination>
          </div>
        </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import router from '@/router'
import api from './search/api'
import SearchResults from './search/results'

export default {
  name: 'search',
  data () {
    return {
      loading: true,
      error: null,
      query: '',
      index: '',
      start: 0,
      size: 0,
      currentPage: 1,
      meta: {},
      hits: []
    }
  },
  computed: {
    end () {
      return Math.min(this.meta.total, this.start + this.size)
    },
    hasResults () {
      return this.meta.total > 0
    },
    hasQuery () {
      return this.query.length > 0
    },
    totalPage () {
      return Math.ceil(this.meta.total / this.size)
    },
    totalMax () {
      // elastic search only allows at most 10,000 items
      // when using `from` and `size`
      return Math.min(this.meta.total, 10000)
    },
  },
  methods: {
    updateQuery ($route) {
      $route = $route || this.$route
      var query = $route.query
      this.query = (query.q || '').trim()
      this.index = (query.index || '').trim()
      this.start = parseInt(query.start) || 0
      // page size
      this.size = parseInt(query.size) || 20
      this.currentPage = Math.ceil((this.start + 1) / this.size)
    },
    loadResults () {
      api.search({
        index: api.defaultIndex || this.index,
        query: this.query,
        start: this.start,
        size: this.size
      }).then(
        (body) => {
          this.meta = body.meta
          this.hits = body.hits
          this.loading = false
        },
        (error) => {
          this.error = {
            title: error.statusCode + ' ' + error.displayName,
            description: error.message,
          }
          this.loading = false
        }
      )
    },
    gotoPage (page) {
      var start = (page - 1) * this.size
      router.push({
        name: 'search',
        query: {
          q: this.query,
          start: start,
          size: this.size
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.updateQuery(to)
      this.loading = true
      this.loadResults()
    }
  },
  beforeMount () {
    this.updateQuery()
    if (!this.query) {
      this.loading = false;
    }
  },
  mounted () {
    if (!this.loading) {
      return;
    }
    this.loadResults()
  },
  components: {
    SearchResults
  }
}
</script>

<style lang="sass">
.text-sm
  font-size: 13px;

.search-results
  .container
    max-width: 600px;
    min-height: 200px;
    padding-bottom: 80px;
  .el-loading-mask
    padding: 80px 0;

.el-alert__description
  padding-bottom: 5px;

.el-loading-mask.el-loading-fade-enter-active
  transition-delay: 1s;

.el-pagination
  padding: 20px 0;
.el-pager li
  font-size: 16px;
  min-width: 34px;
  padding-left: 8px;
  padding-right: 8px;
  height: 34px;
  line-height: 34px;
.el-pagination span, .el-pagination button
  font-size: 16px;
  min-width: 34px;
  height: 34px;
  line-height: 34px;
.el-pager li.btn-quicknext, .el-pager li.btn-quickprev
  font-size: 12px;
  line-height: 34px;
</style>
