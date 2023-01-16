export function formatNumber(
    number: number, 
    decimals: number = 2) {
    return number.toFixed(2).toLocaleString();
}
