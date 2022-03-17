"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = exports.Visibility = exports.Weather = void 0;
var Weather;
(function (Weather) {
    Weather["Sunny"] = "sunny";
    Weather["Rainy"] = "rainy";
    Weather["Cloudy"] = "cloudy";
    Weather["Stormy"] = "stormy";
    Weather["Windy"] = "windy";
})(Weather = exports.Weather || (exports.Weather = {}));
var Visibility;
(function (Visibility) {
    Visibility["Great"] = "great";
    Visibility["Good"] = "good";
    Visibility["Ok"] = "ok";
    Visibility["Poor"] = "poor";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
var Language;
(function (Language) {
    Language[Language["en-US"] = 0] = "en-US";
    Language[Language["es-ES"] = 1] = "es-ES";
})(Language = exports.Language || (exports.Language = {}));
