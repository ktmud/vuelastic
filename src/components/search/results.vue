<template>
  <div class="results">
    <div class="result-item" v-for="(item, index) in items">
      <h4>
        <a :href="item.url" target="_blank" :title="item.title">
          <span v-html="item.title_h"></span>
        </a>
      </h4>
      <p class="result-url" v-html="item.url_h"></p>
      <p class="result-desc">
        <span class="result-date" v-if="item.pretty_date">{{ item.pretty_date }} -</span>
        <span class="result-exerpt" v-html="item.exerpt"></span>
      </p>
    </div>
    <div class="no-result" v-if="items.length == 0">No more results can be found.</div>
  </div>
</template>

<script>
export default {
  props: ['items', 'query'],
}
</script>

<style lang="sass">
.results
  margin: 10px 0 20px;
.results-count
  margin: 0 0 20px 1px;
  font-size: 13px;
  color: #888;
.result-item
  margin-bottom: 25px;
  // margin-bottom: 15px;
  // padding: 0.5em 1em;
  // border: 1px solid #f0f0f0;
  // box-shadow: 0 2px 0 rgba(0,0,0,0.04);
  em
    font-weight: 600;
    font-style: normal;
  h4
    line-height: 1.3em;
    margin: 0;
    font-weight: 400;
    font-size: 17px;
  p
    line-height: 1.5em;
    margin: 8px 0;
    font-size: 12px;
  .result-url
    margin: 0;
    color: #006621;
    font-size: 14px;
  .result-url, h4 a
    display: inline-block;
    max-width: 100%;
    text-overflow: ellipsis;
    max-height: 1.3em;
    overflow: hidden;
    white-space: nowrap;
.result-date
  display: inline-block;
  color: #666;
  margin-right: 2px;
</style>
