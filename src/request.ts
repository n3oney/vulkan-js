import * as signer from "@wulkanowy/uonet-request-signer-node";
import axios from "axios";
import {uuid} from "uuidv4";

export async function request(url: string, body: any = {}, key: string, pfx: string) {
    const time = Math.floor(Date.now() / 1000);

    const b = JSON.stringify({
        ...body,
        RemoteMobileTimeKey: time,
        TimeKey: time - 1,
        RequestId: uuid(),
        RemoteMobileAppVersion: "18.4.1.388",
        RemoteMobileAppName: "VULCAN-Android-ModulUcznia"
    });
    const podpis = await signer.signContent("CE75EA598C7743AD9B0B7328DED85B06", pfx, b);
    return axios.post(url, b, {
        headers: {
            RequestSignatureValue: podpis,
            "User-Agent": "MobileUserAgent",
            "RequestCertificateKey": key,
            "Content-Type": "application/json"
        }
    });
}
