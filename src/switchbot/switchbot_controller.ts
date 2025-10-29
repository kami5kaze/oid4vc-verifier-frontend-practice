import { HonoConfiguration } from "../di";
import { hmacSha256Base64 } from "./switchbot_api";


export async function controlDevices(config: HonoConfiguration,  deviceId : string): Promise<Response> { 
    console.log("send command now");
    const token = config.switchbotapiToken;
    const secret = config.switchbotapiSecret;
    const apiUrl = config.switchbotapiUrl;

    console.log("hedder生成中");

    const t = Date.now().toString();
    const nonce = crypto.randomUUID();
    const sign = await hmacSha256Base64(token + t + nonce, secret);

    const headers = {
        'Authorization': token,
        'sign': sign,
        't': t,
        'nonce': nonce,
        'Content-Type': 'application/json',
    };

    console.log("body生成中");

    const body = {
        command: "unlock",
        parameter: "default",
        commandType: "command"
    }

    console.log("コマンド送信中");

    const res = await fetch(`${apiUrl}/${deviceId}/commands`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });

    const json = await res.json();
    console.log("Command Response:", JSON.stringify(json, null, 2));
    return Response.json(json);
}


// 自動で対象のsmart lockを開ける場合、 引数をdeviceId→deviceNameに変更し、以下のコメントアウト部分を追記してください。
//追記箇所は"body生成中"の上です。"
// let deviceId: string = "";
    
    // console.log("デバイス探索中");

    // for (let i = 0; i < data["body"]["deviceList"].length ; i++) {
    //     const deviceN = data["body"]["deviceList"][i]["deviceName"];

    //     if (deviceN === deviceName) {
    //         deviceId = data["body"]["deviceList"][i]["deviceId"];
    //         console.log("指定されたデバイスを発見:" + deviceId);
    //         break;
    //     }
        
    //     if(i === data["body"]["deviceList"].length -1){
    //         console.log("指定されたデバイスが見つかりません");
    //         throw new Error(`指定されたデバイスが見つかりません: ${deviceName}`);
    //     }
    // }

    // const json : SwitchBotResponse = { statusCode: 100, message: "Success", body: { deviceList: [ { deviceId: deviceId } ] } };

    // return  json;

    // console.log("デバイスID:" + deviceId);
