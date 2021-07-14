import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; //tailwindcss
import App from './App';
import { GraphProvider } from './context/GraphContext'
import { MessageProvider } from './context/MessageContext';

ReactDOM.render(
	<GraphProvider>
		<MessageProvider>
			<App />
		</MessageProvider>
	</GraphProvider>,
	document.getElementById('root')
);
