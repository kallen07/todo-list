// index.js
var React = require('react');
var ReactDOM = require('react-dom');
import App from './components/App';
import moment from 'moment';

console.log("Hello from JavaScript!");
console.log("The current time is " + moment());

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
