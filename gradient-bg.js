noise = {intensity: 0.05, coverage: 0.7};
BLUR = 150;
highlightColor = "rgba(100,91,59";
gradients = [
    createLinear ({ // Base gradient
        type: "base",
        colors: ["rgba(77,97,86,1)","rgba(82,106,80,1)", "rgba(176,206,169,1)"],
        p0: {x: 0, y: 0},
        p1: {x: 0, y: relY(1)},
        ratio: [0, 0.5, 1]
    }),
    createCircle ({ // Pinhole effect
        type: "pinhole",
        colors: ["rgba(0,0,0,0)", "rgba(0,0,0,1)"],
        center: {x: relX(0.5), y: relY(0.5)},
        r: Math.max(relX(0.7), relY(0.7))
    }),
    createCircle ({
        type: "highlight",
        colors: [highlightColor+",0.6)", highlightColor+",0)"],
        center: {x: relX(0.7), y: relY(0.55)},
        r: Math.min(relX(0.4), relY(0.4))
    }),
    createCircle ({
        type: "highlight",
        colors: [highlightColor+",0.6)", highlightColor+",0)"],
        center: {x: relX(0.5), y: relY(0.4)},
        r: Math.min(relX(0.3), relY(0.3))
    }),
    createCircle ({
        type: "highlight",
        colors: [highlightColor+",0.4)", highlightColor+",0)"],
        center: {x: relX(0.3), y: relY(0.55)},
        r: Math.min(relX(0.4), relY(0.4))
    }),
    createCircle ({
        type: "highlight",
        colors: [highlightColor+",0.4)", highlightColor+",0)"],
        center: {x: relX(0.4), y: relY(0.6)},
        r: Math.min(relX(0.3), relY(0.3))
    }),
    createCircle ({
        type: "highlight",
        colors: [highlightColor+",0.4)", highlightColor+",0)"],
        center: {x: relX(0.6), y: relY(0.6)},
        r: Math.min(relX(0.3), relY(0.3))
    }),
    createCircle ({
        type: "highlight",
        colors: ["rgba(232,221,158,0.5)", highlightColor+",0)"],
        center: {x: relX(0.5), y: relY(0.6)},
        r: Math.min(relX(0.3), relY(0.3))
    }),
];
var firstDraw = false;
$(document).ready(function() {
    var canvas = document.getElementById('c'),
    context = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if(firstDraw)
            window.location.reload();
        firstDraw = true;
        drawStuff();
    }
    resizeCanvas();
});

function drawStuff() {
    var canvas = document.getElementById('c');
    var stage = new createjs.Stage('c');
    var time = {start: new Date().getTime()};
    drawGradients(stage, gradients);
    stage.update();
    time.easel = new Date().getTime();
    stackBlurCanvasRGBA('c', 0, 0, canvas.width, canvas.height, BLUR);
    time.blur = new Date().getTime();
    addNoise(canvas, noise.intensity, noise.coverage);
    time.noise = new Date().getTime();
    logTimes(time);
}

function logTimes(time) {
    console.log("Total:" + (time.noise-time.start), "Canvas:" + (time.easel-time.start), "Blur:" + (time.blur-time.easel), "Noise:"+(time.noise-time.blur));
}

function drawGradients(stage, gradients) {
    for (var i = 0; i < gradients.length; i++) {
        if (Arg("exc") !== gradients[i].type)
            stage.addChild(gradients[i]);
    }
}

function createLinear(params){
    if (!('ratio' in params))
    params.ratio = [0, 1];
    if (!('alpha' in params))
    params.alpha = 1;
    var shape = new createjs.Shape();
    shape.graphics
    .beginLinearGradientFill(params.colors, params.ratio, params.p0.x, params.p0.y, params.p1.x, params.p1.y)
    .rect(0, 0, relX(1), relY(1));
    shape.type = params.type;
    return shape;
}

function createCircle(params){
    if (!('ratio' in params))
    params.ratio = [0, 1];
    if (!('alpha' in params))
    params.alpha = 1;
    var shape = new createjs.Shape();
    shape.graphics
    .beginRadialGradientFill(params.colors, params.ratio, params.center.x, params.center.y, 0, params.center.x, params.center.y, params.r)
    .rect(0, 0, relX(1), relY(1));
    shape.alpha = params.alpha;
    shape.type = params.type;
    return shape;
}

function relX(mult) {
    return window.innerWidth*mult;
}

function relY(mult) {
    return window.innerHeight*mult;
}

function addNoise(canvas, intensity, coverage) {
    var ctx = canvas.getContext('2d');
    // Get canvas pixels
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;
    for (var i = 0, il = pixels.length; i < il; i += 4) {
        var intensity255 = Math.round(255*intensity);
        var color = Math.round(Math.random() * intensity255) + 255 - intensity255;
        if (Math.random() > coverage)
            color = 255;
        // Apply noise pixel with Multiply blending mode for each color channel
        pixels[i] =     pixels[i] * color / 255;
        pixels[i + 1] = pixels[i + 1] * color / 255;
        pixels[i + 2] = pixels[i + 2] * color / 255;
    }
    // Put pixels back into canvas
    ctx.putImageData(imageData, 0, 0);
}
