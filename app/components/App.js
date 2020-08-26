import React from 'react';

class ListItem extends React.Component {
  render() {
    return(
      <li>
        <input type="checkbox"></input>
        {this.props.text}
      </li>
    );
  }
}

class ItemList extends React.Component {
  render() {
    return (
      <ul style={{listStyle: "none"}}>
        {this.props.items.map((item) =>
          <ListItem text={item} />
        )}
      </ul>
    );
  }
}

class NewItemInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.onNewItemTextChange(event.target.value);
  }

  handleSubmit(event) {
    this.props.onSubmit();
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text"
          placeholder="Wash the laundry..."
          value={this.props.newItemText}
          onChange={this.handleChange} />
        <input type="submit" value="Submit"/>
      </form>
    );
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: props.items, newItemText: ""};

    this.onNewItemTextChange = this.onNewItemTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onNewItemTextChange(value) {
    this.setState((state, props) => ({
      newItemText: value
    }));
  }

  onSubmit(value) {
    this.setState((state) => {
      state.items.push(state.newItemText);
      return {
        items: state.items,
        newItemText: ""
      };
    });
  }

  render() {
    return (
      <div>
        <h1>My ToDo List</h1>
        <>
          <NewItemInput onNewItemTextChange={this.onNewItemTextChange}
                        onSubmit={this.onSubmit}
                        newItemText={this.state.newItemText} />
          <ItemList items={this.state.items} />
        </>
      </div>
    );
  }
}

function App() {
  return (
    <TodoList items={["item1", "item2"]} />
  );
}


export default App;
