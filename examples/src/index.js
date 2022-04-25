import React from 'react';
import App from './app/App';
import './index.less';
import './index.css';
import ReactClient from 'react-dom/client';
ReactClient.createRoot(document.getElementById('root')).render(<React.Fragment>
  <App />
</React.Fragment>);
