import { div, init } from 'hacky';

const App = init(() => div(['Hello World!']));

document.body.appendChild(App());
