import styled from "styled-components";
import { ExchangeRate, ExchangeRateList } from "./ExchangeRateList";

interface Props {
    exchangeRates: ExchangeRateList
}

export default function ExchangeRateTable({ exchangeRates }: Props) {
    return <Table>
        <tr>
            <th>Country</th>
            <th>Currency Name</th>
            <th>Amount</th>
            <th>Code</th>
            <th>Rate</th>
        </tr>
        {exchangeRates.map((rate: ExchangeRate) => <tr>
            <td>{rate.Country}</td>
            <td>{rate.Currency}</td>
            <td className="num">{rate.Amount}</td>
            <td className="code">{rate.Code}</td>
            <td className="num">{rate.Rate}</td>
        </tr>)}
    </Table>;
}

const Table = styled.table`
    th, td {
        padding: 2px 10px;
        border: 1px solid #eee;
    }
    th {
        background: #eee;
    }
    tr:nth-child(even) td {
        background: #daedff;
    }
    td {
        text-align: left;
    }
    td.num {
        text-align: right;
    }
    td.code {
        text-align: center;
    }
`;