var highlight_circles;
var unhighlight_circles;
var changeXAxis;
var changeYAxis;

function scatterPlot() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height =400 - margin.top - margin.bottom;

    /*
     * http://bl.ocks.org/weiglemc/6185069
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */

    var xLabel = "Horsepower";
    var yLabel = "MPG";

    var carData = [];
    var graph_width = width - 100;
// setup x
    var xValue = function (d) {
            return +d[xLabel];
        }, // data -> value
        // xScale = d3.scale.linear().range([0, width]), // value -> display
        xScale = d3.scale.linear().range([0, graph_width]), // value -> display
        xMap = function (d) {
            return xScale(xValue(d));
        }, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
    var yValue = function (d) {
            return +d[yLabel];
        }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function (d) {
            return yScale(yValue(d));
        }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");


// setup fill color
    var cValue = function (d) {
            return d.Manufacturer;
        },
        // color = d3.scale.category10();
        color = d3.scale.category20();

// add the graph canvas to the body of the webpage
    var svg = d3    .select("#scatter_plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
    var tooltip = d3.select("#scatter_plot").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// load data
    d3.csv("data/a1-cars.csv", function (error, data) {
        // change string (from CSV) into number format
//    data.forEach(function(d) {
//       d.Calories = +d.Calories;
//        d.Potassium = +d.Potassium;
//        d.Sugars = +d.Sugars;
//    console.log(d);
//    });
        carData = data;
        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
        yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("id", "xlabel")
            .attr("class", "label")
            .attr("x", graph_width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(xLabel);
        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("id", "ylabel")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yLabel);

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("g").attr("class", "dot")
            .append("circle")
            .attr("r", 5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function (d) {
                console.log(d);

                return color(cValue(d));
            })
            .attr("class", function (d) {
                return "circle_" + cValue(d);
            })
            .on("mouseover", function (d) {
                d3.select(this).style("fill", "red").attr("r", 15);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["Car"] + "<br/> (" + xValue(d)
                    + ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", color(cValue(d))).attr("r", 5);
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(-70," + i * 20 + ")";
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .on("mouseover", function (d) {
                var class_name = ".circle_" + d;
                highlight_circles(d);
                highlight_bar(d);
            })
            .on("mouseout", function (d) {
                unhighlight_circles();
                unhighlight_bar();
            });

        // draw legend text
        legend.append("text")
        // .attr("x", width - 24)
            .attr("x", width + 5)
            .attr("y", 9)
            .attr("dy", ".35em")
            // .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        highlight_circles = function(d){
            var class_name = ".circle_" + d;
            d3.selectAll("circle").transition().duration(500).style("opacity", 0);
            d3.selectAll(class_name).transition().duration(500).style("opacity", 1);
        };
        unhighlight_circles = function(){
            d3.selectAll("circle").transition().duration(500).style("opacity", 1);
        };

        changeXAxis = function(elem){
            console.log(elem);
            // d3.select("#xlabel").text(elem);
            xLabel = elem;
            xScale.domain([d3.min(carData, xValue)-1, d3.max(carData, xValue)+1]);
            svg.selectAll(".x.axis")
                .call(xAxis).select(".label").text(xLabel);
            changePos();
        };

        changeYAxis = function(){
            debugger;
            var x = document.getElementById("yAxisMenu").value;
            console.log(x);
            yLabel = x;
            // d3.select("#ylabel").text(x);
            yScale.domain([d3.min(carData, yValue)-1, d3.max(carData, yValue)+1]);
            svg.selectAll(".y.axis")
                .call(yAxis).select(".label").text(yLabel);
            changePos();
        };

        function changePos(){
            svg.selectAll("circle")
                .transition()
                .duration(500)
                .attr("cx", xMap)
                .attr("cy", yMap);
        }
    });
}
