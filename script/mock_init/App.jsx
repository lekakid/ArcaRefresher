import { Box, CssBaseline, StyledEngineProvider } from '@mui/material';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Box>Hello World</Box>;
    </StyledEngineProvider>
  );
}

export default App;
