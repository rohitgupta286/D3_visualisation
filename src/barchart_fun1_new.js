//var sort_fun;
var highlight_bar;
var unhighlight_bar;
var wiki_open;
function barChart(){
    manuf_avg={chevrolet:"20.21",amc:"18.24",audi:"26.71",bmw:"23.75",buick:"20.43",cadillac:"39.5",
    capri:"25",chrysler:"17.26",citroen:"NA",datsun:"31.11",dodge:"22.06",fiat:"28.91",
    ford:"19.69",hi:"9",honda:"33.76",mazda:"30.05",mercedes:"23.9",mercury:"19.11",
    nissan:"36",oldsmobile:"21.1",peugeot:"23.68",plymouth:"21.7",pontiac:"20.125",renault:"32.88",
    saab:"23.9",subaru:"30.52",toyota:"28.16",triumph:"35",volvo:"21.11",vw:"31.84"};

    var sort = false;
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = 800 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom;

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

    var div = d3.select("#bar_chart").append("div").attr("class", "toolTip");

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
        })

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
            .attr("transform", "translate(11," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.400em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .append("text")
            .style("fill","black")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
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
                //.on('mousemove',tip.show)
            .on("mouseover", function(d,i){
                //highlight_circles(d.manufacturer);

                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");


                //if (d.manufacturer)==""
                debugger;
                div.html((d.manufacturer)+"<br>"+"Number of cars: "+(d.value)+"<br>"+"Avg.MPG:  "+manuf_avg[d.manufacturer]);
                debugger;



                highlight_bar_name(d.manufacturer,d.value);
            })

            .on("mouseout", function(d){
                //unhighlight_circles();
                unhighlight_bar_name();
                div.style("display", "none");
            })
            .on("mousedown",function (d) {

                wiki_open(d.manufacturer);
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
        for(var i=0;i<d.length;i++) {

            var col;
            if (d[0] == "toyota"){

                col= "rgb(255, 127, 14)";
            }else if (d[0]=="chevrolet"){
                col ="steelblue";
            }else if(d[0]=="citroen"){
                col = "rgb(44, 160, 44)" ;
            }

            svg.selectAll(".bar").transition().delay(100).style("opacity", 0.2);
            svg.select("#bar_" + d[0]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[1]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[2]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[3]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[4]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[5]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[6]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[7]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[8]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[9]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[10]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[11]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[12]).transition().delay(100).style("opacity", 1).style("fill",col);
            svg.select("#bar_" + d[13]).transition().delay(100).style("opacity", 1).style("fill",col);

            //svg.select("#bar_" + d).transition().delay(100).style("opacity",1);
        }};
    unhighlight_bar = function(){
        svg.selectAll(".bar").transition().delay(100).style("opacity",1).style("fill","rgba(181, 63, 176, 0.45)");
    };
    highlight_bar_name = function(d,i){

        svg.selectAll(".bar").transition().delay(100).style("opacity",0.2);
        svg.select("#bar_" + d).transition().delay(100).style("opacity",1);


    };
    unhighlight_bar_name = function(){
        svg.selectAll(".bar").transition().delay(100).style("opacity",1);
    };

    wiki_open = function(d){


        var burl={saab:"https://en.wikipedia.org/wiki/Saab_Automobile",
            pontiac:"https://en.wikipedia.org/wiki/Pontiac",
            chevrolet:"https://en.wikipedia.org/wiki/Chevrolet",
            buick:"https://en.wikipedia.org/wiki/Buick",
            plymouth:"https://en.wikipedia.org/wiki/Plymouth_(automobile)",
            amc:"https://en.wikipedia.org/wiki/American_Motors",
            ford:"https://en.wikipedia.org/wiki/Ford_Motor_Company",
            citroen:"https://en.wikipedia.org/wiki/Citro%C3%ABn",
            dodge:"https://en.wikipedia.org/wiki/Dodge",
            toyota:"https://en.wikipedia.org/wiki/Toyota",
            datsun:"https://en.wikipedia.org/wiki/Datsun",
            vw:"https://en.wikipedia.org/wiki/Volkswagen",
            peugeot:"https://en.wikipedia.org/wiki/Peugeot",
            audi:"https://en.wikipedia.org/wiki/Audi",
            bmw:"https://en.wikipedia.org/wiki/BMW",
            hi:"https://en.wikipedia.org/wiki/Hi-Riser_(automobile)",
            mercury:"https://en.wikipedia.org/wiki/Mercury_(automobile)",
            fiat:"https://en.wikipedia.org/wiki/Fiat_Automobiles",
            oldsmobile:"https://en.wikipedia.org/wiki/Oldsmobile",
            chrysler:"https://en.wikipedia.org/wiki/Chrysler",
            mazda:"https://en.wikipedia.org/wiki/Mazda",
            volvo:"https://en.wikipedia.org/wiki/Volvo",
            renault:"https://en.wikipedia.org/wiki/Renault",
            honda:"https://en.wikipedia.org/wiki/Honda",
            subaru:"https://en.wikipedia.org/wiki/Subaru",
            capri:"https://en.wikipedia.org/wiki/Ford_Capri",
            mercedes:"https://en.wikipedia.org/wiki/Mercedes-Benz",
            cadillac:"https://en.wikipedia.org/wiki/Cadillac",
            triumph:"https://en.wikipedia.org/wiki/Triumph_Motor_Company",
            nissan:"https://en.wikipedia.org/wiki/Nissan",



        };

        document.getElementById("showskill").setAttribute("src",burl[d]);

    };

}

