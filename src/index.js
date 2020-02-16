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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const uuidv4_1 = require("uuidv4");
const request = require("./request");
class Vulkan {
    constructor() {
        this.route = "";
        this.symbol = "";
        this.fullRoute = "";
        this.privateKey = "";
        this.setRouteByToken = (token) => __awaiter(this, void 0, void 0, function* () {
            const response = (yield axios_1.default.get("http://komponenty.vulcan.net.pl/UonetPlusMobile/RoutingRules.txt")).data;
            let routesObject = {};
            for (let line of response.split("\n")) {
                if (line.length === 0)
                    continue;
                const parts = line.split(",");
                routesObject[parts[0]] = parts[1].slice(0, -1);
            }
            console.log(routesObject);
            this.route = routesObject[token.substr(0, 3)];
            this.fullRoute = `${this.route}/${this.symbol}`;
        });
        this.getCertificate = (token, pin, symbol, deviceName, androidVersion) => __awaiter(this, void 0, void 0, function* () {
            this.symbol = symbol;
            const time = Date.now();
            const res = yield axios_1.default.post(`${this.route}/${symbol}/mobile-api/Uczen.v3.UczenStart/Certyfikat`, {
                PIN: pin,
                TokenKey: token,
                AppVersion: "18.4.1.388",
                DeviceId: uuidv4_1.uuid(),
                DeviceName: deviceName,
                DeviceNameUser: "",
                DeviceDescription: "",
                DeviceSystemType: "Android",
                DeviceSystemVersion: androidVersion,
                RemoteMobileTimeKey: time,
                TimeKey: time - 1,
                RequestId: uuidv4_1.uuid(),
                RemoteMobileAppVersion: "18.4.1.388",
                RemoteMobileAppName: "VULCAN-Android-ModulUcznia"
            }, {
                headers: {
                    RequestMobileType: "RegisterDevice",
                    "User-Agent": "MobileUserAgent",
                    "Content-Type": "application/json"
                }
            });
            this.privateKey = res.data.CertyfikatPfx;
            this.setRouteByToken(token);
            return res.data;
        });
        this.getStudents = (certRes) => __awaiter(this, void 0, void 0, function* () {
            return (yield request.request(`${this.fullRoute}/mobile-api/Uczen.v3.UczenStart/ListaUczniow`, {}, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
        });
        this.startApp = (certRes, studentsRes) => __awaiter(this, void 0, void 0, function* () {
            yield request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.UczenStart/LogAppStart`, {}, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx);
            return null;
        });
        this.getTimetable = (certRes, studentsRes) => __awaiter(this, void 0, void 0, function* () {
            const DataPoczatkowa = new Date().toISOString().replace(/T/, ' ').substr(0, 10);
            const DataKoncowa = new Date(Date.now() + 604800000).toISOString().replace(/T/, ' ').substr(0, 10);
            return (yield request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami`, {
                DataPoczatkowa: DataPoczatkowa,
                DataKoncowa: DataKoncowa,
                IdOddzial: studentsRes.Data[0].IdOddzial,
                IdOkresKlasyfikacyjny: studentsRes.Data[0].IdOkresKlasyfikacyjny,
                IdUczen: studentsRes.Data[0].Id
            }, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
        });
        this.getDictionaries = (certRes, studentsRes) => __awaiter(this, void 0, void 0, function* () {
            return (yield request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.Uczen/Slowniki`, {}, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
        });
        this.getTests = (certRes, studentsRes) => __awaiter(this, void 0, void 0, function* () {
            const DataPoczatkowa = new Date().toISOString().replace(/T/, ' ').substr(0, 10);
            const DataKoncowa = new Date(Date.now() + 604800000).toISOString().replace(/T/, ' ').substr(0, 10);
            return (yield request.request(`${this.fullRoute}/${studentsRes.Data[0].JednostkaSprawozdawczaSymbol}/mobile-api/Uczen.v3.Uczen/Sprawdziany`, {
                DataPoczatkowa: DataPoczatkowa,
                DataKoncowa: DataKoncowa,
                IdOddzial: studentsRes.Data[0].IdOddzial,
                IdOkresKlasyfikacyjny: studentsRes.Data[0].IdOkresKlasyfikacyjny,
                IdUczen: studentsRes.Data[0].Id
            }, certRes.TokenCert.CertyfikatKlucz, certRes.TokenCert.CertyfikatPfx)).data;
        });
    }
}
exports.default = Vulkan;
//# sourceMappingURL=index.js.map