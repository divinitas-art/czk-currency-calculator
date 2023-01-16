import styled from "styled-components";
import { useForm } from "../hooks/useForm";
import { ExchangeRate, ExchangeRateList } from "./ExchangeRateList";

interface Props {
    exchangeRates: ExchangeRateList;
}
interface FormValues {
    currencyCode: ExchangeRate['Code'];
    amount: number;
}
export default function ExchangeRateForm({ exchangeRates }: Props) {
    const {
        handleChange,
        values,
    } = useForm<FormValues>({ currencyCode: 'EUR', amount: 1000 });

    const selectedRate = exchangeRates.find((rate: ExchangeRate) => rate.Code === values.currencyCode);
    
    return <Form>
        <Row>
            <label>CZK: </label>
            <input name="amount" type="number" step=".01" value={values.amount} onChange={handleChange} />
        </Row>
        <Row>
            <label>Convert to: </label>
            <select name="currencyCode" defaultValue={values.currencyCode} onChange={handleChange}>
                {exchangeRates.map((rate: ExchangeRate) =>
                    <option key={rate.Code} value={rate.Code}>
                        {rate.Code} - {rate.Currency} - {rate.Country}
                    </option>
                )}
            </select>
        </Row>
        {!!selectedRate && <ResultRow>
            {values.amount.toFixed(2).toLocaleString()} CZK <span> equals to </span>
            {(values.amount / selectedRate?.Rate
                * selectedRate?.Amount)
                .toFixed(2).toLocaleString()} {selectedRate.Code}
        </ResultRow>}
    </Form>;
}

const Form = styled.form`
    label {
        width: 100px;
        margin: 0 20px;
        text-align: right;
        display: inline-block;
    }
    input, select {
        border: 1px solid #3498db; /* Blue */
        border-radius: 5px;
        padding: 10px;
        font-size: 18px;
        width: 300px;
        box-sizing: border-box;
    }
`;

const Row = styled.div`
    margin: 20px 10px;
`;

const ResultRow = styled.div`
    margin: 20px 10px;
    font-weight: bold;
    font-size: 25px;
    span {
        font-size: 18px;
        padding: 10px;
    }
`;