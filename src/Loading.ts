import styled, { keyframes } from 'styled-components';

export const Loading = styled.div`
    display: inline-block;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    border-radius: 50%;    
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */

    ::before,
    ::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: inherit;
        height: inherit;
    }

    @keyframes spin {
        0% {
        transform: rotate(0deg);
        }
        100% {
        transform: rotate(360deg);
        }
    }
`;