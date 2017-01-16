// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { App } from './components/App';

import '../../node_modules/normalize-css/normalize.css';
import './styles';

function main() {
    ReactDom.render(<App />, document.querySelector('#root'));
}

if (typeof window !== 'undefined' && window.document) {
    main();
}
