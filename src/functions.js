function changeXAxis(elem){
    console.log(elem);
    // d3.select("#xlabel").text(elem);
    xLabel = elem;
    xScale.domain([d3.min(carData, xValue)-1, d3.max(carData, xValue)+1]);
    svg.selectAll(".x.axis")
        .call(xAxis).select(".label").text(xLabel);
    changePos();
};

function changeYAxis(){
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



function sortChart(){

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

