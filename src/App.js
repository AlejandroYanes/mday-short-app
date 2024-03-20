import { QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from './providers/auth';
import EntryPoint from './components/entry-point';
import { queryClient } from './utils/query';
import 'monday-ui-react-core/dist/main.css';
import './App.css';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EntryPoint />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
