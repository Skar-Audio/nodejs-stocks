import '../styles/globals.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';

export default function App({Component, pageProps}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						refetchOnWindowFocus: false
					}
				}
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}
