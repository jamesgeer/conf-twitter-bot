import { AccountProvider } from './features/accounts/context/AccountContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import Index from './pages/Index';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AccountProvider>
				<Router>
					<Header />
					<Index />
				</Router>
			</AccountProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
