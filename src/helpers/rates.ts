import { ExchangeRate } from "../Exchange/ExchangeRateList";

export function calculateCZKToCurrency(rate: ExchangeRate, amount: number) { 
    return amount / rate.Rate * rate.Amount;
}