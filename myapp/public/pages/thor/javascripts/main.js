"use strict";

(function () {
    $( document ).ready(function() {
        init();
    });
})();

function init () {
    $('#background')[0].play();

    var $body = $('body');
    var $canvas = $('<canvas>');
    $canvas.attr("width", window.innerWidth || document.body.clientWidth);
    $canvas.attr("height", window.innerHeight || document.body.clientHeight);
    $body.append($canvas);

    var MAX_BUG_NUM = 5;
    var INTERVAL_CREATE_BUG = 1000;
    var INTERVAL_MOVE_BUG = 900;
    var MOVE_BUG_RATIO = 2;

    var bugQueue = [];

    intervalCreateBug($canvas, bugQueue, MAX_BUG_NUM, INTERVAL_CREATE_BUG);
    intervalMoveBug($canvas, bugQueue, INTERVAL_MOVE_BUG, MOVE_BUG_RATIO);
}

function intervalMoveBug ($canvas, bugQueue, INTERVAL_MOVE_BUG, MOVE_BUG_RATIO) {
    var cvWidth = $canvas.width();
    var cvHeight = $canvas.height();

    setInterval(function () {
        for (var i=0; i<bugQueue.length; i++) {
            if (i < bugQueue.length) {
                moveBug($canvas, bugQueue[i], INTERVAL_MOVE_BUG, cvWidth, cvHeight, MOVE_BUG_RATIO);
            }
        }
    }, INTERVAL_MOVE_BUG);
}

function moveBug ($cv, bug, INTERVAL_MOVE_BUG, cvWidth, cvHeight, MOVE_BUG_RATIO) {
    var x = 0;
    var y = 0;

    var distance = parseInt(Math.random() * cvWidth / MOVE_BUG_RATIO);

    var calAngle = Math.PI * 2 / 360;
    if (bug.angle > 270) {
        x = bug.x - parseInt(distance * Math.cos(calAngle * (bug.angle - 270)));
        y = bug.y - parseInt(distance * Math.sin(calAngle * (bug.angle - 270)));
    } else if (bug.angle > 180) {
        x = bug.x - parseInt(distance * Math.cos(calAngle * (bug.angle - 180)));
        y = bug.y + parseInt(distance * Math.sin(calAngle * (bug.angle - 180)));
    } else if (bug.angle > 90) {
        x = bug.x + parseInt(distance * Math.cos(calAngle * (bug.angle - 90)));
        y = bug.y + parseInt(distance * Math.sin(calAngle * (bug.angle - 90)));
    } else {
        x = bug.x + parseInt(distance * Math.cos(calAngle * bug.angle));
        y = bug.y - parseInt(distance * Math.sin(calAngle * bug.angle));
    }

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > cvWidth) x = cvWidth;
    if (y > cvHeight) y = cvHeight;

    var angle = parseInt(Math.random() * 90);
    angle += generateAngle(x, y, cvWidth, cvHeight);

    $cv.animateLayer(bug.name, {
        rotate: bug.angle
    }, {
        duration: 20,
        complete: function (layer) {
            $(this).stopLayer(layer, true);
            $(this).animateLayer(layer, {
                x: x,
                y: y
            }, {
                easing: "ease",
                duration: INTERVAL_MOVE_BUG - 20
            });
        }
    });

    bug.x = x;
    bug.y = y;
    bug.angle = angle;
}

function intervalCreateBug ($canvas, bugQueue, MAX_BUG_NUM, INTERVAL_CREATE_BUG) {
    var autoIncrement = 0;

    setInterval(function () {
        if (bugQueue.length < MAX_BUG_NUM) {
            bugQueue.push(drawBug($canvas, bugQueue, autoIncrement));
            autoIncrement++;
        }
    }, INTERVAL_CREATE_BUG);
}

function drawBug ($cv, bugQueue, current) {
    var name = "bug" + current;
    var fileName = "butterfly" + parseInt(Math.random() * 5) + ".png";

    var cvWidth = $cv.width();
    var cvHeight = $cv.height();

    var x = parseInt(Math.random() * 2) * parseInt(Math.random() * cvWidth);
    var y = 0;
    if (x) {
        y = parseInt(Math.random() * 2) * cvHeight;
    } else {
        x = parseInt(Math.random() * 2) * cvWidth;
        y = parseInt(Math.random() * cvHeight);
    }

    var angle = parseInt(Math.random() * 90);
    angle += generateAngle(x, y, cvWidth, cvHeight);

    $cv.drawImage({
        layer: true,
        source: 'pages/thor/images/bugs/' + fileName,
        name: name,
        x: x,
        y: y,
        width: 128,
        height: 128,
        shadowColor: '#000',
        shadowBlur: 10,
        shadowX: 10,
        shadowY: 10,
        rotate: angle,
        touchstart: function (layer) {
            var $effect = $('<audio src="/pages/thor/audios/effect.mp3">');
            $effect.bind("ended", function (e) {
                $(this).remove();
            });
            $('body').append($effect);
            $effect[0].load();
            $effect[0].play();

            for (var i = 0; i < bugQueue.length; i++) {
                if (bugQueue[i].name == layer.name) {
                    bugQueue.splice(i, 1);
                    break;
                }
            }
            $(this).stopLayer(layer, true);
            $(this).animateLayer(layer, {
                scale: 1.5
            }, {
                duration: 200,
                complete: function (layer) {
                    $(this).animateLayer(layer, {
                        scale: 1
                    }, {
                        duration: 200,
                        complete: function (layer) {
                            $(this).removeLayer(layer).drawLayers();
                        }
                    })
                }
            });
        }
    });

    return {
        name: name,
        x: x,
        y: y,
        angle: angle
    }
}

function generateAngle (x, y, maxWidth, maxHeight) {
    if (x > maxWidth / 2 && y > maxHeight / 2) {
        return 270;
    } else if (x > maxWidth / 2) {
        return 180;
    } else if (y > maxHeight / 2) {
        return 0;
    } else {
        return 90;
    }
}