var url = "pdx_zones.geojson";

// color scale settings
var minimum = 0, maximum = 11000;
var minimumColor = "white", maximumColor = 'teal';
var color = d3.scaleLinear().domain([minimum, maximum]).range([minimumColor, maximumColor]);

var startingYear = 2008;

//linear gradient key
var w = 140, h = 300;

var key = d3.select("#content").append("svg").attr("id", "key").attr("width", w).attr("height", h);

var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "100%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");

legend.append("stop").attr("offset", "0%").attr("stop-color", maximumColor).attr("stop-opacity", 1);

legend.append("stop").attr("offset", "100%").attr("stop-color", minimumColor).attr("stop-opacity", 1);

key.append("rect").attr("width", w - 100).attr("height", h - 100).style("fill", "url(#gradient)").attr("transform", "translate(0,10)");

var y = d3.scaleLinear().range([200, 0]).domain([minimum, maximum]);

var yAxis = d3.axisRight(y);

key.append("g").attr("class", "y axis").attr("transform", "translate(42,10)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 50).attr("dy", "1em").style("text-anchor", "end").text("Estimated Rider Count").style('fill', 'black');
//end key

// render choropleth
d3.json(url, function(error, sextants) {

    var projection = d3.geoMercator()
    .fitSize([900, 500], sextants)

    var geoGenerator = d3.geoPath()
    .projection(projection);
    
    var u = d3.select('#content g.map')
        .selectAll('path')
        .data(sextants.features);
    
        u.enter()
        .append('path')
        .attr('d', geoGenerator)
        .style("fill", function(d) {
            return color(d.properties.Bike_Counts.value[2008])
        })  
});

// Function to update the map
function updateMap(year) {
        var u = d3.select('#content g.map')
            .selectAll('path');
          
        u.transition()
            .style("fill", function(d) {
              return color(d.properties.Bike_Counts.value[year])
            })
        u.exit().remove()
};


//slider
var dataTime = d3.range(0, 11).map(function(d) {
    return new Date(2008 + d, 11, 3);
  });

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(2008, 11, 3))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
      updateMap(d3.timeFormat('%Y')(val));
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
//end slider