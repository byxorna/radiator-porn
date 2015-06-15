var colorClasses = ['yellow','orange','red','magenta','violet','blue','cyan','green'];
var colorClassesBase = ['base03','base02','base01'];

function randomBaseColor(id) {
  return _randomVal(id,colorClassesBase);
};
function randomColor(id) {
  return _randomVal(id,colorClasses);
};
function _randomVal(id,arr){
  if (id === null || id === undefined) {
    return arr[Math.floor(Math.random()*arr.length)];
  } else {
    return arr[id.hashCode()%arr.length];
  }
};
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
function changeviewport(){
  // translates and scales the map in response to zoom/drag inputs
  map.attr('transform','translate(' + d3.event.translate.join(',') + ') scale(' + d3.event.scale + ')');
}

// generates random points in geo coordinates
function randomLatLong(){
  return {
    lat: Math.random()*180-90,
    lon: Math.random()*360-180
  };
}

var width = 960,
    height = 800;

var svg = d3.select('body').append('svg')
	.attr('width',width)
	.attr('height',height);
var map = svg.append('g').attr('class','map');
var blipsgroup = svg.append('g').attr('class','blips');
var projection = d3.geo.mercator().translate([width/2, height/2]);
var zoom = d3.behavior.zoom().scaleExtent([1,10]).on('zoom',changeviewport);
var path = d3.geo.path().projection(projection);
d3.json('geo.json', function(error, geo){
  if (error) return console.error(error);
  console.log(geo);
  //var subunits = topojson.feature(geo, geo.objects.subunits);
  var places = topojson.feature(geo, geo.objects.places);
  // set up zooming and panning
  svg.call(zoom); // bind zoom to the doc

  // pull out each subunit feature as a separate path
  // this will draw a path for each country
  map.selectAll('.subunit').data(topojson.feature(geo, geo.objects.subunits).features)
	  .enter().append('path')
	  .attr('class',function(d){ return "subunit " + d.id + " " + randomBaseColor(d.id); })
	  .attr('d',path);

  setInterval(function(){
    // select a random place from places and blip it
    var city = places.features[Math.floor(places.features.length*Math.random())];
    var blips = blipsgroup.selectAll('.blip').data([city]);
    console.log(city.properties.name);
    //http://bl.ocks.org/mbostock/3808218
    blips.enter()
      .append('circle')
      .attr('class','blip').attr('r',2)
      .attr('transform', function(d){return "translate("+projection([d.geometry.coordinates[0],d.geometry.coordinates[1]])+")";})
      .transition().duration(700).ease('cubic-in-out').attr('r',15).style('opacity',0).remove();
      //.attr('transform', function(d){return "translate("+projection([d.lon,d.lat])+")";})
  },1000);





});



