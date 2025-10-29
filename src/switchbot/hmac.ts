import * as crypto from 'node:crypto';
import { HonoConfiguration } from '../di/HonoConfiguration.js';



export function hmacMatch(config: HonoConfiguration, data_past: Buffer , data_now: Buffer, hmac: string): Promise<Boolean> { 
    const key = config.hmacKey;
    const als = [config.algorithm1, config.algorithm2, config.algorithm3];
    const recievedHmac = Buffer.from(hmac, 'base64url');
    const keyByte = Buffer.from(key, 'utf-8');
    let errorMessage = "";

    if (!key) {
        errorMessage = "Missing HMAC_SECRET in env";
    } else if (als.length === 0) {
        errorMessage = "Missing ALGORITHM in env";
    } else if (!hmac) {
        errorMessage = "Missing HMAC in request";
    } else if (data_now.length === 0 || data_past.length === 0) {
        errorMessage = "Missing data to verify HMAC";
    }

    if (errorMessage) {
        throw new Error(errorMessage);
    }
    
    for (const al of als) { 
        data_past = crypto.createHmac(al, keyByte).update(data_past).digest();
        data_now = crypto.createHmac(al, keyByte).update(data_now).digest();
    }

    console.log("data_past HMAC:", data_past.toString('base64url'));
    console.log("data_now HMAC:", data_now.toString('base64url'));
    console.log("recieved HMAC:", recievedHmac.toString('base64url'));

    const match1 = crypto.timingSafeEqual(recievedHmac, Buffer.from(data_past.toString('base64url'), 'base64url'));
    const match2 = crypto.timingSafeEqual(recievedHmac, Buffer.from(data_now.toString('base64url'), 'base64url'));

    return Promise.resolve(match1 || match2);
}

export function getTimestamp(interval: number , now =  Date.now()): number[] {
    const intervalMs = interval * 60_000;
    const ts1 = Math.floor(now / intervalMs - 1) * intervalMs;
    const ts2 = Math.floor(now / intervalMs) * intervalMs;
    return [ts1, ts2];
}
