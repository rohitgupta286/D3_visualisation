var sort_fun;
var highlight_bar;
var unhighlight_bar;

function barChart(){
    var sort = false;
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#bar_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var car_data = [];

    d3.csv("data/a1-cars.csv", function(data) {
        var car_map = new Map();

        data.forEach(function(d){
            var cnt = car_map.get(d.Manufacturer);
            if(cnt == undefined)
                cnt = 1;
            else
                cnt += 1;
            car_map.set(d.Manufacturer, cnt);
        });
        var iterator = car_map.keys();
        console.log(car_map.size);
        for(var i = 0; i < car_map.size;i++)
        {
            var key = iterator.next().value;
            car_data.push({"manufacturer" : key, "value" : +car_map.get(key) })
        }
        x.domain(car_data.map(function(d) { return d.manufacturer; }));
        y.domain([0, d3.max(car_data, function(d) { return d.value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.50em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Count");

        svg.selectAll(".bar")
            .data(car_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function(d){
                return "bar_" + d.manufacturer;
            })
            .attr("x", function(d) { return x(d.manufacturer); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .on("mouseover", function(d){
                //highlight_circles(d.manufacturer);
                highlight_bar(d.manufacturer);
            })
            .on("mouseout", function(d){
                //unhighlight_circles();
                unhighlight_bar();
            });
    });
    sort_fun = function(){

        var x0 = x.domain(car_data.sort(function(a, b) { return b.value - a.value;})
            .map(function(d) { return d.manufacturer; }))
            .copy();

//        svg.selectAll(".bar")
//                .sort(function(a, b) { return x0(a.manufacturer) - x0(b.manufacturer); });
        svg.selectAll(".bar")
            .transition()
            .delay(100)
            .attr("x", function(d) { return x0(d.manufacturer); });

        svg.select(".x.axis")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.50em")
            .attr("transform", "rotate(-90)" );
    };
    highlight_bar = function(d){
        svg.selectAll(".bar").transition().delay(100).style("opacity",0.2);
        svg.select("#bar_" + d).transition().delay(100).style("opacity",1);
    };
    unhighlight_bar = function(){
        svg.selectAll(".bar").transition().delay(100).style("opacity",1);
    };



}

