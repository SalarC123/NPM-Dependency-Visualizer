import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; //tailwindcss
import App from './App';
import {GraphProvider} from './context/GraphContext'

ReactDOM.render(
  <GraphProvider>
    <App />
  </GraphProvider>,
  document.getElementById('root')
);
