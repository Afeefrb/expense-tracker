import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'
import {Provider} from './context/context'
import {SpeechProvider} from '@speechly/react-client'

ReactDOM.render(
    <SpeechProvider appId="7aed0763-8a2d-4c71-a903-0a9d1e93e2d4" language="en-US">
        <Provider>
                    <App />
        </Provider>
    </SpeechProvider>
 

, document.getElementById("root"));