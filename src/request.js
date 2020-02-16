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
const signer = require("@wulkanowy/uonet-request-signer-node");
const axios_1 = require("axios");
const uuidv4_1 = require("uuidv4");
function request(url, body = {}, key, pfx) {
    return __awaiter(this, void 0, void 0, function* () {
        const time = Math.floor(Date.now() / 1000);
        const b = JSON.stringify(Object.assign(Object.assign({}, body), { RemoteMobileTimeKey: time, TimeKey: time - 1, RequestId: uuidv4_1.uuid(), RemoteMobileAppVersion: "18.4.1.388", RemoteMobileAppName: "VULCAN-Android-ModulUcznia" }));
        const podpis = yield signer.signContent("CE75EA598C7743AD9B0B7328DED85B06", pfx, b);
        return axios_1.default.post(url, b, {
            headers: {
                RequestSignatureValue: podpis,
                "User-Agent": "MobileUserAgent",
                "RequestCertificateKey": key,
                "Content-Type": "application/json"
            }
        });
    });
}
exports.request = request;
//# sourceMappingURL=request.js.map