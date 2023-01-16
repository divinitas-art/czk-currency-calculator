import * as express from 'express';
import * as https from 'https';
import * as csv from 'csvtojson';
import * as cors from 'cors';
import { ExchangeRateList } from './src/Exchange/ExchangeRateList';

export const EXCHANGE_RATE_HOST = "www.cnb.cz";
export const EXCHANGE_RATE_URI = "/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

export default function wait(timeoutMs: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, timeoutMs));
}

const app = express();
const PORT = 8005;

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
                    exchangeCSVToExchangeRateList(data).then((data: ExchangeRateList) => {
                        resolve(data);
                    });
                } catch (e) {
                    console.error(e);
                    clearTimeout(timeoutId);
                    reject(new Error('Error getting data...'));
                }
            });
        });

        req.on('error', (e: Error) => {
            reject(e);
        });

        req.end();
    });
}

function removeFirstLine(data: string) {
    return data.slice(data.indexOf('\n') + 1);
}
async function exchangeCSVToExchangeRateList(data: string): Promise<ExchangeRateList> {
    const exchangeList = await csv({
        trim: true,
        delimiter: '|',
    }).fromString(removeFirstLine(data));
    return exchangeList.map((rate) => {
        return {
            Country: rate.Country,
            Amount: parseInt(rate.Amount),
            Code: rate.Code,
            Currency: rate.Currency,
            Rate: parseFloat(rate.Rate),
        };
    });
}

async function loopGetNewData() {
    while (true) {        
        await refreshExchangeData();
        const hour = 60 * 60 * 1000;
        await wait(hour); //every hour
    }
}

async function refreshExchangeData() {
    latestExchangeData = await getCurrentData();
}
  
app.get('/exchange', cors(), async (req, res) => {
    // make sure we have data
    if (!latestExchangeData) {
        await refreshExchangeData();
    }
    res.send(latestExchangeData);
});

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})

// start get data loop
loopGetNewData();
