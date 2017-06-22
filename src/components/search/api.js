/*
 * ElasticSearch API
 *
 * Copyright (C) 2017 Jesse Yang <hello@yjc.me>
 *
 * Distributed under terms of the MIT license.
 */
import { Client } from 'elasticsearch-browser'

const api = new Client({
  httpAuth: 'elastic:changeme',
  host: {
    host: '',
    port: '',
    path: '/api'
  }
})

api.defaultIndex = 'webpages'

api.queryBody = function(query, from, size) {
  return {
    "size": size,
    "from": from,
    "query": query,
    "highlight": {
      "fields": {
        "title": {},
        "url": {},
        "text": {}
      }
    },
    "stored_fields": [ "title", "url" ],
    "_source": [ "headers.last-modified" ]
  }
}

api._search = api.search

function cleanHitItem (item) {
  var text_h = item.highlight.text || item.fields.text || []
  var title_h = item.highlight.title || item.fields.title || []
  var url_h = item.highlight.url || item.fields.url || []
  return {
    title: item.fields.title[0].trim(),
    title_h: title_h[0],
    exerpt: text_h.slice(0, 2).join(' '),
    url: item.fields.url[0],
    url_h: url_h[0],
    date: new Date(item._source['headers.last-modified'])
  }
}

api.search = opt => {
  var query = opt.query
  if (typeof query == 'string') {
    query = {
      multi_match: {
        query: query,
        fields: ['title^3', 'url', 'text']
      }
    }
  }
  return api._search({
    index: opt.index,
    body: api.queryBody(query, opt.start, opt.size)
  }).then(body => {
    return {
      meta: {
        took: body.took / 1000,
        total: body.hits.total
      },
      hits: body.hits.hits.map(cleanHitItem)
    }
  })
}

export default api
