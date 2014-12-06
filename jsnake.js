////////////////////////////////////////////////////////////////////////////////
// JSnake Library
////////////////////////////////////////////////////////////////////////////////

var __jsnake_consume = [];
var __jsnake_produce = [];

var __jsnake_lib = {
    pygame: {
        init: function () {
            __jsnake_div = document.getElementById('jsnake');
        },
        display: {
            set_mode: function (size) {
                var screen = document.createElement('canvas');
                screen.width = size[0];
                screen.height = size[1];
                __jsnake_div.appendChild(screen);
                return __jsnake_lib.pygame.Surface(size, screen);
            },
            flip: function () {
                __jsnake_flip = true;
            }
        },
        font: {
            Font: function (name, size) {
                return {
                    render: function (text, antialias, color) {
                        // todo
                    }
                };
            },
        },
        Surface: function (size, canvas) {
            return {
                width: size[0],
                height: size[1],
                canvas: canvas,
                fill: function (color) {
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = __jsnake_rgb_to_hex(color);
                    ctx.fillRect(0, 0, size[0], size[1]);
                },
                blit: function (surface, pos) {
                    // todo
                }
            };
        },
        Rect: function (left, top, width, height) {
            return {
                left: left,
                top: top,
                width: width,
                height: height,
                move: function (direction) {
                    return __jsnake_lib.pygame.Rect(
                        this.left + direction[0],
                        this.top + direction[1],
                        this.width,
                        this.height
                    );
                }
            };
        },
        draw: {
            rect: function (surface, color, rect) {
                var ctx = surface.canvas.getContext("2d");
                ctx.fillStyle = __jsnake_rgb_to_hex(color);
                ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
            }
        },
        event: {
            poll: function () {
                if (__jsnake_consume.length == 0) {
                    return __jsnake_lib.pygame.event.Event(null, null);
                } else {
                    var event = __jsnake_consume[0];
                    __jsnake_consume.slice(0, 1);
                    return event;
                }
            },
            Event: function (kind, key) {
                return {
                    type: kind,
                    key: key
                }
            },
            post: function (event) {
                __jsnake_produce.push(event);
            }
        },
        locals: {
            KEYDOWN: 2,
            QUIT: 12,
            K_q: 113,
            K_r: 114,
            K_UP: 273,
            K_DOWN: 274,
            K_RIGHT: 275,
            K_LEFT: 276
        },
        time: {
            Clock: function () {
                return {
                    tick: function (fps) {
                        __jsnake_fps = fps;
                    }
                }
            }
        },
        quit: function () {
            // todo
        }
    },
    random: {
        randrange: function (value) {
            return Math.floor(Math.random() * value);
        }
    },
    itertools: {
        count: function () {
            var curr = 0;
            return {
                has_next: function () { return true; },
                next: function () {
                    var temp = curr;
                    curr += 1;
                    return temp;
                }
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// Python Built-ins
////////////////////////////////////////////////////////////////////////////////

function str(obj) {
    return obj.toString();
}

function len(arr) {
    return arr.length;
}

function min(left, right) {
    return (left < right ? left : right);
}

function range(value) {
    var curr = 0;
    return {
        next: function() {
            var temp = curr;
            curr += 1;
            return temp;
        },
        has_next: function() {
            return (curr < value);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// JSnake Helpers
////////////////////////////////////////////////////////////////////////////////

function __jsnake_iter(item) {
    if (item instanceof Array) {
        var pos = 0;
        return {
            next: function () {
                var temp = item[pos];
                pos += 1;
                return temp;
            },
            has_next: function () {
                return pos < item.length;
            }
        };
    } else {
        return item;
    }
}

function __jsnake_in(val, arr) {
    return (arr.indexOf(val) >= 0);
}

function __jsnake_index(arr, val) {
    return (val >= 0 ? val : val + arr.length);
}

function __jsnake_rgb_to_hex(rgb) {
    function toHex(val) {
        var hex = val.toString(16);
        return (hex.length == 1 ? '0' + hex : hex);
    }
    return '#' + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
}

Array.prototype.append = Array.prototype.push;

////////////////////////////////////////////////////////////////////////////////

__jsnake_inst = __jsnake_prog();
__jsnake_fps = 10;
__jsnake_flip = false;
__jsnake_start = (new Date()).getTime();
__jsnake_yield = (new Date()).getTime();
__jsnake_sleep = 0;

function __jsnake_run() {
    __jsnake_start = (new Date()).getTime();

    // Amount of time since we last ran. This accounts for processing events
    // like key presses.

    var behind = __jsnake_start - __jsnake_yield - __jsnake_sleep;

    while (!__jsnake_flip) {
        __jsnake_inst.next();
    }

    __jsnake_yield = (new Date()).getTime();

    var frame = 1000 / __jsnake_fps;

    // Amount of time screen drawing and event processing required.

    var duration = __jsnake_yield - __jsnake_start + behind;

    __jsnake_sleep = Math.max(frame - duration, 0);
    __jsnake_flip = false;

    setTimeout(__jsnake_run, __jsnake_sleep);
}

__jsnake_run();
