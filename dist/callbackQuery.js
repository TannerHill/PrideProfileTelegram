"use strict";
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
exports.parseCallbackQueryUpdate = exports.addSplitColors = exports.getAndProcessProfilePicture = void 0;
var jimpProcessor_1 = require("./jimpProcessor");
var template_1 = __importDefault(require("./template"));
var strings_json_1 = require("./strings.json");
var keyboard_1 = require("./keyboard");
var strings_json_2 = require("./strings.json");
var getAndProcessProfilePicture = function (id, colorRange, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userProfilePhotos, photo, photoUrl, settings, imageBuffer;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, ctx.telegram.getUserProfilePhotos(id, 0, 1)];
            case 1:
                userProfilePhotos = _c.sent();
                photo = userProfilePhotos.photos.shift().pop();
                return [4, ctx.telegram.getFileLink(photo)];
            case 2:
                photoUrl = _c.sent();
                if (!photoUrl) return [3, 5];
                settings = ctx.session.settings;
                return [4, jimpProcessor_1.applyPride(photoUrl.toString(), {
                        colorRange: colorRange,
                        opacity: (_a = settings === null || settings === void 0 ? void 0 : settings.opacity) !== null && _a !== void 0 ? _a : jimpProcessor_1.defaultOptions.opacity,
                        shape: (_b = settings === null || settings === void 0 ? void 0 : settings.shape) !== null && _b !== void 0 ? _b : jimpProcessor_1.defaultOptions.shape
                    })];
            case 3:
                imageBuffer = _c.sent();
                if (!imageBuffer) return [3, 5];
                return [4, ctx.replyWithPhoto({
                        source: imageBuffer,
                        filename: photo.file_id + '.png'
                    })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                ctx.session.currentInput = null;
                return [2];
        }
    });
}); };
exports.getAndProcessProfilePicture = getAndProcessProfilePicture;
var addSplitColors = function (colors, id, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!ctx.session.currentInput) return [3, 2];
                ctx.session.currentInput = [colors];
                return [4, keyboard_1.sendKeyboard(ctx)];
            case 1:
                _a.sent();
                return [3, 4];
            case 2:
                ctx.session.isSplitInput = false;
                ctx.session.currentInput.push(colors);
                return [4, exports.getAndProcessProfilePicture(id, ctx.session.currentInput, ctx)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2];
        }
    });
}); };
exports.addSplitColors = addSplitColors;
var parseCallbackQueryUpdate = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var callbackQuery, data, _a, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                callbackQuery = ctx.callbackQuery;
                data = JSON.parse(callbackQuery.data);
                return [4, ctx.telegram.deleteMessage(ctx.chat.id, callbackQuery.message.message_id)];
            case 1:
                _b.sent();
                if (!(typeof data === 'string')) return [3, 8];
                _a = data;
                switch (_a) {
                    case strings_json_1.stringConstants.callbackQuery.split: return [3, 2];
                    case strings_json_1.stringConstants.callbackQuery.custom: return [3, 4];
                    case strings_json_1.stringConstants.callbackQuery.cancel: return [3, 6];
                }
                return [3, 7];
            case 2:
                ctx.session.isSplitInput = true;
                return [4, keyboard_1.sendKeyboard(ctx)];
            case 3:
                _b.sent();
                return [3, 7];
            case 4:
                ctx.session.isCustomInput = true;
                return [4, ctx.reply(strings_json_2.replies.custom + strings_json_2.replies.hexExample)];
            case 5:
                _b.sent();
                return [3, 7];
            case 6:
                {
                    ctx.session = {};
                    return [3, 7];
                }
                _b.label = 7;
            case 7: return [3, 16];
            case 8:
                if (!(typeof data === 'number')) return [3, 16];
                if (!ctx.session.isSplitInput) return [3, 10];
                return [4, exports.addSplitColors(template_1["default"][data].colorRange, callbackQuery.from.id, ctx)];
            case 9:
                _b.sent();
                return [3, 14];
            case 10:
                _b.trys.push([10, 12, 13, 14]);
                return [4, exports.getAndProcessProfilePicture(callbackQuery.from.id, template_1["default"][data].colorRange, ctx)];
            case 11:
                _b.sent();
                return [3, 14];
            case 12:
                e_1 = _b.sent();
                return [3, 14];
            case 13: return [7];
            case 14: return [4, ctx.answerCbQuery()];
            case 15:
                _b.sent();
                _b.label = 16;
            case 16: return [2];
        }
    });
}); };
exports.parseCallbackQueryUpdate = parseCallbackQueryUpdate;
//# sourceMappingURL=callbackQuery.js.map