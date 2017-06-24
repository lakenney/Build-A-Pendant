/*
 * JSON data structure for Pendant data.
 * I credit Rob Frenette with helping me convert my long winded, Repeating code 
 * into this beautiful JSON data structure!
*/

var data =  {
    "shapes" : {
        "circle": {
            "silver" : [
                {"sm":"20", "md":"25", "lg":"30"},
            ],
            "bronze" : [
                {"sm":"12", "md":"15", "lg":"18"},
            ]
        },
        "square": {
            "silver" : [
                {"sm":"20", "md":"25", "lg":"30"},
            ],
            "bronze" : [
                {"sm":"12", "md":"15", "lg":"18"},
            ]
        },
        "heart": {
            "silver" : [
                {"sm":"20", "md":"25", "lg":"30"},
            ],
            "bronze" : [
                {"sm":"12", "md":"15", "lg":"18"},
            ]
        }
    }
};

function Pendant(shape, metal, size, price) {
    this.shape = shape;
    this.metal = metal;
    this.size = size;
    this.price = price;
}
Pendant.prototype.addPendant = function(pendants) {
    pendants.push(this);
}
Pendant.prototype.getPendant = function() {
    return this;
}

function loadData(pendants) {
    for (var key in data) {
        var shapes = data[key];
        for (var shape in shapes) {
            var theShape = shapes[shape];
            for (var metal in theShape) {
                var theMetal = theShape[metal];
                for (var sizes in theMetal) {
                    var theSizes = theMetal[sizes];

                    for (var size in theSizes) {
                        var price = theSizes[size];
                        var pendant = new Pendant(shape, metal, size, price);
                        pendant.addPendant(pendants);
                    }
                }
            }
        }
    }
}
