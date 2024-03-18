import { QueryClientProvider } from '@tanstack/react-query'

import LinksList from './components/links-list';
import { queryClient } from './utils/query';

import 'monday-ui-react-core/dist/main.css';
import './App.css';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <LinksList />
      </div>
    </QueryClientProvider>
  );
};

export default App;
