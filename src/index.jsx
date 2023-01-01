import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const appContainer = document.createElement('div');
document.body.append(appContainer);

ReactDOM.render(<App />, appContainer);