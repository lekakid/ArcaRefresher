import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import store from 'store';
import { light, dark } from 'theme';

import Feature from 'feature';
import Core from 'core';

export default function App() {
  const browserDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [arcaDarkMode, setArcaDarkMode] = useState(
    document.documentElement.classList.contains('theme-dark'),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setArcaDarkMode(
        document.documentElement.classList.contains('theme-dark'),
      );
    });
    observer.observe(document.documentElement, { attributes: true });
  }, []);

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={browserDarkMode || arcaDarkMode ? dark : light}>
          <Core />
          <Feature />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}
