"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.applyPride = exports.defaultOptions = exports.ShapeTypes = void 0;
var jimp_1 = __importDefault(require("jimp"));
var mime = __importStar(require("mime"));
var util_1 = require("./util");
var ShapeTypes;
(function (ShapeTypes) {
    ShapeTypes[ShapeTypes["Square"] = 1] = "Square";
    ShapeTypes[ShapeTypes["Circle"] = 2] = "Circle";
    ShapeTypes[ShapeTypes["Ring"] = 6] = "Ring";
})(ShapeTypes = exports.ShapeTypes || (exports.ShapeTypes = {}));
exports.defaultOptions = {
    colorRange: [0x00000000],
    shape: ShapeTypes.Ring,
    zoom: 10,
    thickness: 0.2,
    opacity: 0.7
};
var getColor = function (colorParameters) {
    var shape = colorParameters.shape, colorRange = colorParameters.colorRange, point = colorParameters.point, height = colorParameters.height, width = colorParameters.width, distanceFromCenter = colorParameters.distanceFromCenter, innerDitherStart = colorParameters.innerDitherStart, outerDitherStart = colorParameters.outerDitherStart, radius = colorParameters.radius, innerRadius = colorParameters.innerRadius;
    var baseColor = 0xFFFFFF00;
    var colorOptions = [0xFFFFFF00];
    if (!colorRange.some(Array.isArray)) {
        colorOptions = colorRange;
    }
    else {
        var colorSplitIndex = Math.floor(point.x / (width / colorRange.length));
        colorOptions = colorRange[colorSplitIndex];
    }
    var colorIndex = Math.floor(point.y / (height / colorOptions.length));
    baseColor = colorOptions[colorIndex];
    return isInRange(distanceFromCenter, outerDitherStart, radius) && !util_1.hasFlag(shape, ShapeTypes.Square)
        ? (baseColor + 0xFF) - interpolateOpacity(distanceFromCenter, outerDitherStart, radius)
        : isInRange(distanceFromCenter, innerRadius, innerDitherStart) && util_1.hasFlag(shape, ShapeTypes.Ring)
            ? baseColor + interpolateOpacity(distanceFromCenter, innerRadius, innerDitherStart)
            : (baseColor + 0xFF);
};
var applyPride = function (imageUrl, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, radius, thickness, colorRange, zoom, _b, shape, _c, opacity, image, width, height, center, innerRadius, thicknessPx, outerDitherStart, innerDitherStart;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = __assign(__assign({}, exports.defaultOptions), options), radius = _a.radius, thickness = _a.thickness, colorRange = _a.colorRange, zoom = _a.zoom, _b = _a.shape, shape = _b === void 0 ? exports.defaultOptions.shape : _b, _c = _a.opacity, opacity = _c === void 0 ? exports.defaultOptions.opacity : _c;
                return [4, jimp_1["default"].read(imageUrl)];
            case 1:
                image = _d.sent();
                radius = radius ? radius : (image.getWidth() / 2);
                width = radius * 2;
                height = width;
                center = { x: radius - 1, y: radius - 1 };
                radius += zoom;
                innerRadius = util_1.hasFlag(shape, ShapeTypes.Ring)
                    ? radius * (1 - thickness)
                    : 0;
                thicknessPx = radius * thickness;
                outerDitherStart = Math.floor(radius - (thicknessPx * 0.1));
                innerDitherStart = Math.floor(innerRadius + (thicknessPx * 0.1));
                return [2, new Promise(function (resolve, reject) {
                        new jimp_1["default"](width, height, function (ringErr, ring) {
                            if (!ringErr) {
                                for (var i = 0; i < width; i++) {
                                    for (var j = 0; j < height; j++) {
                                        var point = { x: i, y: j };
                                        var distance = getDistance(center, point);
                                        var color = getColor({
                                            colorRange: colorRange,
                                            distanceFromCenter: distance,
                                            height: height,
                                            width: width,
                                            innerDitherStart: innerDitherStart,
                                            outerDitherStart: outerDitherStart,
                                            innerRadius: innerRadius,
                                            point: point,
                                            radius: radius,
                                            shape: shape
                                        });
                                        if (isInRange(distance, innerRadius, radius) || shape === ShapeTypes.Square) {
                                            ring.setPixelColor(color, point.x, point.y);
                                        }
                                    }
                                }
                                image.composite(ring, 0, 0, { mode: jimp_1["default"].BLEND_SOURCE_OVER, opacitySource: opacity, opacityDest: 1 }, function (compositeErr, composite) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (!compositeErr)
                                            resolve(composite.getBufferAsync(mime.getType('png')));
                                        else
                                            reject(compositeErr);
                                        return [2];
                                    });
                                }); });
                            }
                            else {
                                reject(ringErr);
                            }
                        });
                    })];
        }
    });
}); };
exports.applyPride = applyPride;
var isInRange = function (value, min, max) {
    return value >= min && value <= max;
};
var getDistance = function (first, second) {
    var distance = Math.sqrt(Math.pow(second.x - first.x, 2) + Math.pow(second.y - first.y, 2));
    return distance;
};
var interpolateOpacity = function (value, min, max) {
    var proportion = (value - min) / (max - min);
    return Math.floor(proportion * 255);
};
//# sourceMappingURL=jimpProcessor.js.map