/*
 * ElasticSearch API
 *
 * Copyright (C) 2017 Jesse Yang <hello@yjc.me>
 *
 * Distributed under terms of the MIT license.
 */
import { Client } from 'elasticsearch-browser'
import moment from 'moment'

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
      "number_of_fragments": 2,
      "fragment_size": 200,
      "fields": {
        "title": {},
        "url": {},
        "text": {}
      }
    },
    "stored_fields": [ "title", "url" ],
    "_source": [ "headers.last-modified", "headers.date" ]
  }
}

api._search = api.search

function cleanHitItem (item) {
  var text_h = item.highlight.text || item.fields.text || []
  var title_h = item.highlight.title || item.fields.title || []
  var url_h = item.highlight.url || item.fields.url || []
  var headers = item._source.headers || {}
  var lastModified = headers['last-modified']
  var date = lastModified ? new Date(lastModified) : null
  return {
    title: item.fields.title[0].trim(),
    title_h: title_h[0],
    // 1 piece of highlighted text is too short,
    // 3 pieces are too long
    exerpt: text_h.join(' ... '),
    url: item.fields.url[0],
    url_h: url_h[0],
    date: date,
    pretty_date: text_h ? prettyDate(date) : ''
  }
}

var DAY = 60*60*24*1000

function prettyDate (date) {
  if (isNaN(date) || date === null) {
    return ''
  }
  // if too far away, display full date
  if (new Date() - date > 180 * DAY) {
    return moment(date).format('YYYY-MM-DD')
  }
  return moment(date).fromNow()
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
