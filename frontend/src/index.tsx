import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Index from './pages/Index';
import Header from './components/layout/Header';
import { AccountProvider } from './features/accounts/context/AccountContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<AccountProvider>
			<Router>
				<Header />
				<Index />
			</Router>
		</AccountProvider>
	</React.StrictMode>,
);
