import { ThemeProvider as MondayThemeProvider } from 'monday-ui-react-core';
import mondaySdk from 'monday-sdk-js';
import { useEffect, useState } from 'react';

const monday = mondaySdk();

const useGetContext = () => {
  const [context, setContext] = useState({});

  useEffect(() => {
    monday.listen('context', (res) => {
      setContext(res.data);
    });
  }, []);

  return context;
};

export default function ThemeProvider(props) {
  const context = useGetContext();

  return (
    <MondayThemeProvider themeConfig={context.themeConfig} systemTheme={context.theme}>
      {props.children}
    </MondayThemeProvider>
  );
};
