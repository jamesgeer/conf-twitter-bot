import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Index from './pages/Index';
import Header from './components/layout/Header';
import { AccountProvider } from './context/AccountContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<AccountProvider>
			<Header />
			<Index />
		</AccountProvider>
	</React.StrictMode>,
);
