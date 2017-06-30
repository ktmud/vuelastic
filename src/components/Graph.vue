<template>
  <div class="graph-container" v-loading="loading">
  </div>
</template>

<script>
import sigma from "sigma"
import {
  scaleSequential, scaleLinear, scaleLog, scaleQuantize
} from "d3-scale"
import { interpolatePiYG, interpolatePuRd, interpolateSpectral } from "d3-scale-chromatic"
import "sigma/build/plugins/sigma.parsers.json.min"
import "sigma/build/plugins/sigma.plugins.animate.min"
import "sigma/build/plugins/sigma.layout.forceAtlas2.min"
import "sigma/build/plugins/sigma.layout.noverlap.min"
import "sigma/build/plugins/sigma.plugins.dragNodes.min"
import "sigma/build/plugins/sigma.renderers.parallelEdges.min"
import "sigma/build/plugins/sigma.renderers.customEdgeShapes.min"

var color = scaleSequential(interpolateSpectral);

function array (items, key='weight') {
  let vals = items.map(item => item[key])
  return {
    extent () {
      return [Math.min(...vals), Math.max(...vals)]
    },
    sorted () {
      // sort in reversed order
      return vals.sort().reverse()
    },
    vals: vals,
    length: vals.length
  }
}


export default {
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    sigma.parsers.json('/static/domain_graph.json', {
      renderer: {
        // IMPORTANT:
        // This works only with the canvas renderer, so the
        // renderer type set as "canvas" is necessary here.
        container: this.$el,
        // type: 'canvas'
      },
      settings: {
        font: 'Helvetica',
        edgeColor: 'source',
        labelThreshold: 10000,
        sideMargin: 0.1,  // in pixels
        // minArrowSize: 0.5,
        // defaultEdgeType: 'curvedArrow',
        // drawHoverNodes: false,
        // scalingMode: 'outside',
        // enableEdgeHovering: true,
        // edgeHoverSizeRatio: 2,
        minEdgeSize: 0.1,
        maxEdgeSize: 2,
        minNodeSize: 1,
        maxNodeSize: 5
      }
    }, (s) => {
      var arr = array(s.graph.nodes())
      var domain = arr.extent()
      var segsize = Math.ceil(arr.length / 5)
      var sorted = arr.sorted()
      var nodeColor = color.domain([0, arr.length])
      var nodeX = scaleLinear().domain([0, segsize]).range([0, 7])
      // put nodes into rows
      // needs plus one segsize here because d3 scales
      // are not end point inclusive
      var nodeY = scaleQuantize()
        .domain([0, arr.length + segsize])
        .range([0, 1, 2, 3, 4, 5])

      var seenIdx = {}

      // Display the nodes on a circle:
      s.graph.nodes().forEach(function(node, i, a) {
        var idx
        if (node.weight in seenIdx) {
          // in case of tie positions
          seenIdx[node.weight] += 1
          idx = seenIdx[node.weight]
        } else {
          idx = sorted.indexOf(node.weight)
          seenIdx[node.weight] = idx
        }
        // console.log(idx)
        node.x = nodeX(idx % segsize)
        node.y = nodeY(idx)
        // the position of current node in a sorted list
        node.size = node.weight
        node.color = nodeColor(idx)
      })
      s.graph.edges().forEach((edge, i, a) => {
        edge.size = edge.count2
      })
      // Start the layout:
      // s.startForceAtlas2();
      sigma.plugins.dragNodes(s, s.renderers[0]);
      s.renderers[0].bind('render', () => {
        this.loading = false
      })
      s.refresh()
    });
  }
}
</script>

<style lang="sass">
.graph-container
  height: 660px;
</style>
