import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from 'store/store';
import App from './App';

import './pretendard/pretendard.css'
import './index.css';

import './dev';

ReactDOM.createRoot(document.querySelector("div#root")).render(
    <Provider store={store}>
        <App />
    </Provider>
)