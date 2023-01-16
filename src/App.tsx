import { useQuery } from "react-query";
import { EXCHANGE_RATE_URL } from "./const";
import { Loading } from "./Loading";
import styled from "styled-components";
import ExchangeRateForm from "./Exchange/ExchangeRateForm";
import ExchangeRateTable from "./Exchange/ExchangeRateTable";

function App() {
    const { isLoading, error, data: exchangeRates } = useQuery('exchangeRate', () =>
        fetch(EXCHANGE_RATE_URL).then((response) => response.json())
    );

    if (isLoading) {
        return <Centered>            
            <Loading />
            <p>Loading exchange rates...</p>
        </Centered>;
    }

    if (error) {
        return <Centered>
            <Error>We are sorry, but we are experiencing issues with getting the exchnage data</Error>
        </Centered>;
    }
    
    return (
        <Centered>
            <Logo src="exchange512.png" title="Logo" />
            <ExchangeRateForm exchangeRates={exchangeRates} />
            <ExchangeRateTable exchangeRates={exchangeRates} />
        </Centered>
    );
}

export const Centered = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export const Error = styled.p`
    border: 1px solid #3a0000;
    color: #3a0000;
    background: #d4b2b2;
    padding: 5px;
`;
const Logo = styled.img`
    width: 100px;
    height: 100px;
`;

export default App;
