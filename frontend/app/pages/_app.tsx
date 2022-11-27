import type { AppProps } from 'next/app'
import { UserProvider } from '../contexts/UserContext';

const App = ({ Component, pageProps }: AppProps) => (
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
);

export default App;
