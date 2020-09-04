// index.js
var React = require('react');
var ReactDOM = require('react-dom');
import TodoList from './components/TodoList';

console.log("Hello from JavaScript!");

ReactDOM.render(
  <TodoList />,
  document.getElementById('root')
);
