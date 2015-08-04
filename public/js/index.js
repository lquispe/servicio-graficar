function init(list) {
  graphBubbleChart(list);
  graphBarChart(list);
}

function graphBubbleChart(data) {
  var diameter = 960,
    format = d3.format(',d'),
    color = d3.scale.category20c();

  var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

  var svg = d3.select('main').append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .attr('class', 'bubble');

  var root = {
    children: data
  };

  var node = svg.selectAll('.node')
    .data(bubble.nodes(root)
      .filter(function(d) {
        return !d.children;
      }))
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  node.append('title')
    .text(function(d) {
      return d.name + ': ' + format(d.value);
    });

  node.append('circle')
    .attr('r', function(d) {
      return d.r;
    })
    .style('fill', function(d) {
      return color(Math.random());
    });

  node.append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .text(function(d) {
      return d.name.substring(0, d.r / 3);
    });


  d3.select(self.frameElement).style('height', diameter + 'px');
}

function graphBarChart(data) {
  var margin = {
      top: 20,
      right: 20,
      bottom: 100,
      left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var svg = d3.select('main').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(data.map(function(d) {
    return d.name;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.value;
  })]);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', function(d) {
      return 'rotate(-45)';
    });

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Ocurrencias');

  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return x(d.name);
    })
    .attr('width', x.rangeBand())
    .attr('y', function(d) {
      return y(d.value);
    })
    .attr('height', function(d) {
      return height - y(d.value);
    });

  function type(d) {
    d.value = +d.value;
    return d;
  }
}

function documentReady() {
  console.log('DOM loaded.');
  var btn = document.querySelector('#loadBtn');
  var startElem = document.querySelector('#startInput');
  var endElem = document.querySelector('#endInput');
  var start;
  var end;

  btn.addEventListener('click', function() {
    if (start && end) {
      // borró elementos svg previos
      var svgElem = document.querySelector('svg');
      while (svgElem) {
        svgElem.remove();
        svgElem = document.querySelector('svg');
      }

      // utilizar fetch() para realizar una solicitud a /data con los
      // valores de las variables start y end cómo parámetros en la querystring
      // por ejemplo: /data?starttime=2014-08-04&endtime=2014-08-3
      // si el status code de la respuesta es 200 entonces invocar la función init con el valor
      // de la respuesta
      // si el status code no fué 200, muestro un error
    } else {
      // input inválidos -> mostrar error
    }
  });

  rome(startElem, {
    time: false
  }).on('data', function(value) {
    start = value;
  });
  rome(endElem, {
    time: false
  }).on('data', function(value) {
    end = value;
  });
}

document.addEventListener('DOMContentLoaded', documentReady, false);