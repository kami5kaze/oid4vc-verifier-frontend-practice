import { HonoConfiguration } from "../di";

export interface SwitchBotResponse {
        statusCode: number;
        message: string;
        body: {
            deviceList: any[];
            infraredRemoteList?: any[];
        };
    }

export async function getDevicesData(config: HonoConfiguration): Promise<SwitchBotResponse> {
    const token = config.switchbotapiToken;
    const secret = config.switchbotapiSecret;
    const apiUrl = config.switchbotapiUrl;
    
    if (!token || !secret) {
        throw new Error("Missing SWITCHBOT_TOKEN or SWITCHBOT_SECRET in env");
    }
    console.log("変数宣言中");
    const t = Date.now().toString();
    const nonce = crypto.randomUUID();
    const sign = await hmacSha256Base64(token + t + nonce, secret);

    console.log("データ取得開始");

    try {
        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'sign': sign,
                't': t,
                'nonce': nonce,
                'Content-Type': 'application/json',
            },
        });

        console.log("データ取得完了");

        const json : SwitchBotResponse = await res.json();
        console.log("SwitchBot API Response:", JSON.stringify(json, null, 2));
        return json;
    } catch (e) {
        console.error("Network error while fetching devices:", e);
        throw new Error("Network error while fetching devices");
    }

};

export async function hmacSha256Base64(message: string, secret: string) {
    console.log("HMAC署名生成中");
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

