/**
 * Created by Ananya on 5/9/2017.
 */
/*var data = [
 [0,-0,0,0,0,3 ],
 [1,-1,1,2,1,6 ],
 [2,-2,4,4,0.5,2],
 [3,-3,9,6,0.33,4],
 [4,-4,16,8,0.25,9]
 ];*/
function parallel() {

   debugger;

    var blue_to_brown = d3.scale.ordinal()

        .range(["red", "blue", "yellow"]);

    var color = function (d) {
        debugger;
        return blue_to_brown(d['Origin']);
    }

    d3.csv('data/cars.csv', function (data) {
        var pc = d3.parcoords()("#example")
            .data(data)
            .color(color)
            .alpha(0.336)
            //.composite("lighter")
            .render()
            .createAxes()
            .reorderable()
            .brushMode("1D-axes")
            .interactive();

    });
}