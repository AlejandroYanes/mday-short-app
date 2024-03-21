/* eslint-disable max-len */
import { QueryClientProvider } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';

import { AuthProvider } from './providers/auth';
import EntryPoint from './components/entry-point';
import { queryClient } from './utils/query';
import 'monday-ui-react-core/dist/main.css';
import './App.css';

const App = () => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <EntryPoint />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
