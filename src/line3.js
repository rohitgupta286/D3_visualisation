var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//var parseDate = d3.time.format("%Y").parse;
var parseTime = d3.parseTime("%Y");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yValue = "count";
var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[yValue]); });

var svg = d3.select("#line").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataYear = function(d) { return +d.Model_Year;};
var new_data = [];

var focus = svg.append("g")
    .style("display", "none");


d3.csv("data/cars.csv",function(d){
    debugger;
    d.model_year = parseTime(d.model_year);
    //d.Average_weight = +d.Average_weight;
return d;
}, function(error, data) {
    if (error) throw error;

    var filmdata = [];
    data.forEach(function(d) {
        debugger;
        if(filmdata[d.Model_Year] != undefined)
        {
            debugger;
            filmdata[d.Model_Year].count++;
            filmdata[d.Model_Year].pop += +d.weight;
        }
        else
        {
            filmdata[d.Model_Year] = [];
            filmdata[d.Model_Year].year = d.Year;
            filmdata[d.Model_Year].count = 1;
            filmdata[d.Model_Year].pop = +d.weight;
        }
    });
    var max_year = d3.max(data, dataYear);
    var min_year = d3.min(data, dataYear) - 1;
    for(var i = min_year;i< max_year + 1;i++)
    {
        debugger;
        var tmp = [];
        tmp.date = parseDate(i + "");
        if(filmdata[i] != undefined)
        {
            tmp.count = filmdata[i].count;
            tmp.pop = filmdata[i].pop;
        }
        else
        {
            tmp.count = 0;
            tmp.pop = 0;
        }
        new_data.push(tmp);
    }
    x.domain(d3.extent(new_data, function(d) { return d['model_year']; }));
    y.domain(d3.extent(new_data, function(d) { return d[yValue]; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yValue);

    svg.append("path")
        .datum(new_data)
        .attr("class", "line")
        .attr("stroke", "steelblue")
        .attr("d", line);

    // append the circle at the intersection               
    focus.append("circle")                                 
        .attr("class", "tooltip")
        .style("fill", "steelblue")
        .style("stroke", "steelblue")
        .attr("r", 4);

    focus.append("text")
        .attr("class", "yvalue")
        .style("stroke", "black")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // append the rectangle to capture mouse               
    svg.append("rect")                                     
        .attr("width", width)                              
        .attr("height", height)                            
        .style("fill", "none")
        .style("pointer-events", "all")                    
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(new_data, x0, 1),
            d0 = new_data[i - 1],
            d1 = new_data[i];
            //d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.select(".tooltip")
            .attr("transform",                             
                "translate(" + x(d.date) + "," +         
                y(d[yValue]) + ")");

        focus.select(".yvalue").attr("transform",
                "translate(" + x(d.date) + "," +
                y(d[yValue]) + ")")
            .text(d[yValue]);
    }                                                      

});