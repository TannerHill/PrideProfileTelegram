"use strict";
exports.__esModule = true;
exports.hasFlag = exports.setNthBit = exports.isNthBitSet = void 0;
var isNthBitSet = function (value, bit) {
    return (value & (1 << bit)) !== 0;
};
exports.isNthBitSet = isNthBitSet;
var setNthBit = function (value, bit) {
    return value | (1 << bit);
};
exports.setNthBit = setNthBit;
var hasFlag = function (value, flag) {
    return (value & flag) === flag;
};
exports.hasFlag = hasFlag;
//# sourceMappingURL=util.js.map