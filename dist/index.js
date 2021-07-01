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
var telegraf_1 = require("telegraf");
var callbackQuery_1 = require("./callbackQuery");
var keyboard_1 = require("./keyboard");
var textMessage_1 = require("./textMessage");
var dotenv_1 = require("dotenv");
var mongodb_1 = require("mongodb");
var telegraf_session_mongodb_1 = require("telegraf-session-mongodb");
var strings_json_1 = require("./strings.json");
var express_1 = __importDefault(require("express"));
var url_1 = require("url");
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.config();
}
var _a = process.env, BOT_TOKEN = _a.BOT_TOKEN, MONGODB_URI = _a.MONGODB_URI, NODE_ENV = _a.NODE_ENV, WEBHOOK_URL = _a.WEBHOOK_URL;
var initialize = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bot, db, app, port_1, webhookInfo, path_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bot = new telegraf_1.Telegraf(BOT_TOKEN);
                return [4, mongodb_1.MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })];
            case 1:
                db = (_a.sent()).db();
                bot.use(telegraf_session_mongodb_1.session(db, { collectionName: 'sessions_prideprofile' }));
                bot.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, ctx.reply(strings_json_1.replies.welcome + "\n\n" + strings_json_1.replies.updates, {
                                    parse_mode: 'HTML'
                                })];
                            case 1:
                                _a.sent();
                                return [4, keyboard_1.sendKeyboard(ctx)];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                bot.command('cancel', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ctx.session = {};
                                return [4, ctx.reply(strings_json_1.replies.cancel)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                bot.on('callback_query', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!ctx.callbackQuery.data) return [3, 2];
                                return [4, callbackQuery_1.parseCallbackQueryUpdate(ctx)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2];
                        }
                    });
                }); });
                bot.on('text', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, textMessage_1.parseTextUpdate(ctx)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                bot["catch"](function (err, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, ctx.reply(strings_json_1.replies.error.exception)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                process.once('SIGINT', function () { return bot.stop('SIGINT'); });
                process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
                if (!(NODE_ENV !== 'production')) return [3, 2];
                console.log('Started Polling...');
                bot.launch();
                return [3, 4];
            case 2:
                console.log('Starting Webhook...');
                app = express_1["default"]();
                port_1 = process.env.PORT || 80;
                return [4, bot.telegram.getWebhookInfo()];
            case 3:
                webhookInfo = _a.sent();
                if (!(webhookInfo === null || webhookInfo === void 0 ? void 0 : webhookInfo.url)) {
                    bot.telegram.setWebhook(WEBHOOK_URL + BOT_TOKEN);
                }
                path_1 = (webhookInfo === null || webhookInfo === void 0 ? void 0 : webhookInfo.url) ? new url_1.URL(webhookInfo.url).pathname : BOT_TOKEN;
                app.use(bot.webhookCallback(path_1));
                app.get('/', function (req, res) { return res.status(200).send(); });
                app.listen(Number(port_1), function () {
                    console.log("Listening on path: " + path_1 + ", port " + port_1);
                });
                _a.label = 4;
            case 4: return [2];
        }
    });
}); };
initialize();
//# sourceMappingURL=index.js.map