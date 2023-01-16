import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 30px;
        font-family: Open-Sans, Helvetica, Sans-Serif;
        font-size: 18px;
    }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient()

root.render(    
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
