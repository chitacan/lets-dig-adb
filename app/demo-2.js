(function() {
  var d3 = require('./lib/bower_components/d3/d3.js');
  var activitykit = require('activitykit');

  function activityDemo() {
    var anchor = document.querySelector('#demo-2-anchor')
      , parent = anchor.parentElement || window
      , MARGIN = {top: 5, right: 40, bottom: 5, left: 40}
      , duration = 750
      , step   = 100;

    var maxWidth  = 900
      , maxHeight = 600
      , width  = Math.min(window.innerWidth,  maxWidth)
      , height = Math.min(window.innerHeight, maxHeight)

    var statusInfo = d3.select('#status');
    var tree = d3.layout.tree()
    .size([height, 1])
    .separation(function() { return 1; });

    var svg = d3.select(anchor).append("svg")
    .attr("width", width - MARGIN.left - MARGIN.right)
    .attr("height", height - MARGIN.top - MARGIN.bottom)

    var g = svg
    .append("g")
    .attr("transform", function(d) { return "translate(-50," + MARGIN.top + ")"; });

    g.append("g").attr("class", "link")
    g.append("g").attr("class", "node")

    function updateTree(root) {
      statusInfo.style({
        'display': 'none'
      });

      var stack = root.stack;
      var focused = root.focused;

      var nodes = tree.nodes(stack);
      var links = tree.links(nodes);

      var link = g.select(".link")
      .selectAll("path")
      .data(links)

      link.enter().append("path").attr("class", linkType);
      link.exit().remove();

      var node = g.select(".node")
      .selectAll("g")
      .data(nodes)

      node.enter()
      .append("g")
      .attr("class", function(d) { return d.type; })
      .each(function(d) {
        d3.select(this).append('rect');
        d3.select(this).append("text")
        .attr("class", "name")
        .attr("dy", ".35em")
        .attr("x", function(d) { return 6; });
        d3.select(this)
        .append("text")
        .attr("class", "des")
        .attr("dy", ".35em")
      });
      node.select('text.name')
      .text(function(d) { return d.name; })
      .each(function(d) { d.width = Math.max(32, this.getComputedTextLength() + 10); })
      node.select('text.des')
      .text(function(d) {
        if (d.package) return d.package;
      })
      .attr("x", function(d) { return d.width + 10; });

      node.selectAll('rect')
      .classed({
        'focused': function(d) {
          return d.type === 'history' &&
            d.taskId === focused.taskId &&
            d.hash === focused.hash;
        }
      });

      node.exit().remove();

      node
      .filter(function(d) { return "join" in d; })
      .insert("path", "text").attr("class", "join");

      svg.call(layout);

      return svg;
    }

    function linkType(d) {
      return d.target.type.split(/\s+/).map(function(t) { return "to-" + t; })
      .concat(d.source.type.split(/\s+/).map(function(t) { return "from-" + t; }))
      .join(" ");
    }

    function layout(svg) {
      svg.selectAll("*")
      .style("stroke-opacity", null)
      .style("fill-opacity", null)
      .style("display", null);

      var node = svg.selectAll(".node g")
      .attr("class", function(d) { return d.type; })
      .attr("transform", function(d, i) { return "translate(" + d.depth * step + "," + d.x + ")"; });

      node.select("rect")
      .attr("ry", 6)
      .attr("rx", 6)
      .attr("y", -10)
      .attr("height", 20)
      .attr("width", function(d) { return d.width; });

      node.select('.join')
      .attr('d', function(d) {
        var sx = d.width
          , sy = 0
          , tx = d.width
          , ty = d.join * 24
        dx = tx - sx, dy = ty - sy,
        dr = 0.3 * Math.sqrt(dx * dx + dy * dy);
        return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,1 " + tx + "," + ty;
      });

      svg.selectAll(".link path")
      .attr("class", linkType)
      .attr("d", d3.svg.diagonal()
            .source(function(d) {
              return {y: d.source.depth * step + d.source.width, x: d.source.x};
            })
            .target(function(d) {
              return {y: d.target.depth * step, x: d.target.x};
            })
            .projection(function(d) {
              return [d.y, d.x];
            })
           );
    }

    function update() {
      activitykit.getActivityInfo()
      .then(function(stream) {
        stream.on('data', function(data) {
          var data = JSON.parse(data.toString());
          updateTree(data);
        });
      })
      .catch(function(e) {
        statusInfo
        .style({ 'display': 'block' })
        .text(e.message);
      });
    }

    function onResize() {
      var h = Math.min(window.innerHeight, maxHeight) - MARGIN.top - MARGIN.bottom;
      svg.attr("height", h)

      tree.size([h, 1])

      svg.call(layout);
    }

    var intervalId;

    function start() {
      update();
      intervalId = setInterval(update, 1000);
      window.onresize = onResize;
    }

    function stop() {
      clearInterval(intervalId);
    }

    return {
      start: start,
      stop : stop
    }
  }

  var demo  = activityDemo();
  Reveal.addEventListener('slidechanged', function(event) {
    var isDemo = event.currentSlide.id === 'demo-2';
    isDemo ? demo.start() : demo.stop();
  });
})();
