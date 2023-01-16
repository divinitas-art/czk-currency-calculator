import * as express from 'express';
import * as https from 'https';
import * as http from 'http';
import * as WebSocket from 'ws';

export const EXCHANGE_RATE_HOST = "www.cnb.cz";
export const EXCHANGE_RATE_URI = "/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

interface ExchangeRate {
    name: string;
    code: string;
    rate: number;
}
type ExchangeRateList = Record<ExchangeRate['code'], ExchangeRate>;

export default function wait(timeoutMs: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, timeoutMs));
}

const app = express();
const PORT = 8001;

let latestExchangeData = {};

function getCurrentData() {
    return new Promise((resolve: (value: ExchangeRateList) => void, reject: (error: Error) => void) => {
        const options = {
            hostname: EXCHANGE_RATE_HOST,
            port: 443,
            path: EXCHANGE_RATE_URI,
            method: 'GET',
            headers: {
                Origin: `https://${EXCHANGE_RATE_HOST}`,
                Referer: `https://${EXCHANGE_RATE_HOST}`,
            }
        };

        const timeoutId = setTimeout(() => reject(new Error('request timed out')),5000);

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (d) => {
                data += d.toString();
            });
            res.on('end', () => {
                try {
                    clearTimeout(timeoutId);
                    resolve(exchangeCSVToExchangeRateList(data));
                } catch (e) {
                    console.error(e);
                    clearTimeout(timeoutId);
                    reject(new Error('shit fuck'));
                }
            });
        });

        req.on('error', (e: Error) => {
            reject(e);
        });

        req.end();
    });
}

function exchangeCSVToExchangeRateList(data: string) {
    return {};
}

async function loopGetNewData() {
    while (true) {        
        await refreshExchangeData();
        await wait(5000);
    }
}

async function refreshExchangeData() {
    latestExchangeData = await getCurrentData();
}

app.get('/exchange', async (req, res) => {
    // make sure we have data
    if (!latestExchangeData) {
        await refreshExchangeData();
    }
    res.send(latestCNBData);
})

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})

// start get data loop
loopGetNewData();
