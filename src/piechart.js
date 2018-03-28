/**
 * Created by Ananya on 5/6/2017.
 */

var cars_name=[]
function piechart(){
// Width, Height, Margin and Padding
var width = 860,
    height = 400;

var outerRadius = height/2 - 50,
    innerRadius = outerRadius/2,
    radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

var outerArc = d3.arc()
    .outerRadius(outerRadius*1.1)
    .innerRadius(outerRadius*1.1);

var labelArc = d3.arc()
    .outerRadius(outerRadius -30)
    .innerRadius(outerRadius -50);

var arcOpacity = 0.8;

var pie = d3.pie().padAngle(.01);

var svg = d3.select("#pie_plot").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var div = d3.select("#pie_plot").append("div").attr("class", "toolTip");

// Data
d3.csv("data/data.csv", function(d){
    d.var = +d.var;
    return d;
}, function(error, data) {
    if (error) throw error;

    pie.value(function(d) { return d.var; });

// Compute angles
    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

// Create arcs
    var g = svg.selectAll("arc")
        .data(pie(data)).enter().append("g")
        .attr("class", "arc");

// Add forms
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.id); })
        .style("opacity", arcOpacity)
        .attr("class", function(d) { return "path_" + d.data.id } );

// Add labels
    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("text-anchor","middle")
        .text(function(d) { return d.data.id;})
        .style("fill", "#fff");

// Add pie lines
    var polyline = g.append("polylines")
        .attr("class", "lines")
        .data(pie(data), function(d){ return d.data.id })
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("opacity", .5);

    polyline.transition()
        .attrTween("points", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);

            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [labelArc.centroid(d2), outerArc.centroid(d2), pos];
            }
        });

    var polytext = g.append()
        .attr("class", "polytext")
        .text(function(d) { return d.data.id; })
        .style("fill", "#000");

    polytext.transition()
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.id +": "+ d.data.var);
        });



// Mouse interactions
    svg.selectAll("path")
        .on("mousemove", function(d) {

// Arcs color and radius
            d3.selectAll(".path_" + d.data.id)
                .transition().attr("d", arc.outerRadius(outerRadius*1.05))
                .transition().style("opacity", 1);

// Tooltip
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.id)+"<br>"+"Number of Cars:     "+(d.data.var)+"<br>"+"Total Manufacturer: "+(d.data.total));


        })
        .on("mouseout", function(d) {

// Arcs color and radius
            d3.selectAll(".path_" + d.data.id)
                .style("opacity", arcOpacity)
                .transition().attr("d", arc.outerRadius(outerRadius))
                unhighlight_bar();

//.transition().style("fill", function(d) { return color(d.data.id); })

// Tooltip
            div.style("display", "none");

        })

        .on("mouseover", function (d) {


            if(d.data.id =="American") {

                highlight_bar(["chevrolet","buick", "plymouth","amc", "ford", "pontiac", "dodge", "hi", "mercury", "oldsmobile","chrysler", "capri","cadillac"]);
            }else if (d.data.id == "European"){
                    highlight_bar(["citroen","vw", "peugeot", "audi", "saab", "bmw", "buick", "fiat", "volvo", "renault", "mercedes", "triumph"]);
                }else if(d.data.id =="Japenese"){
                highlight_bar(["toyota", "datsun", "mazda", "honda", "subaru", "nissan"]);
            }

    });

});
}