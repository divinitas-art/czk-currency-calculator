export interface ExchangeRate {
    Country: string;
    Currency: string;
    Amount: number;
    Code: string;
    Rate: number;
}
export type ExchangeRateList = ExchangeRate[];