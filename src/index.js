import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss?raw';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import auth from 'Auth'
import axios from 'axios'

axios.interceptors.request.use(config => {
  config.headers.common['Authorization'] = `Bearer ${auth.getToken()}`

  return config
})

ReactDOM.render(<App />, document.getElementById('app'));
registerServiceWorker();
