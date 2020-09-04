import React, { ReactEventHandler, FormEvent, ChangeEvent } from 'react';

type DisplayItemProps = {
  item: TodoItem;
  onCheckboxChange: CallableFunction;
}

class DisplayItem extends React.Component<DisplayItemProps> {
  constructor(props: DisplayItemProps) {
    super(props);
    this.handleItemChecked = this.handleItemChecked.bind(this);
  }

  handleItemChecked(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    this.props.onCheckboxChange(this.props.item.dateCreated, target.checked)
  }

  render() {
    return(
      <li>
        <input type="checkbox" 
               checked={this.props.item.isDone}
               onChange={this.handleItemChecked}/>
        {this.props.item.text}<br/>
        {"date created:" + this.props.item.dateCreated}
      </li>
    );
  }
}

type DisplayListProps = {
  items: Map<number, TodoItem>;
  onCheckboxChange: CallableFunction;
}

function DisplayList(props: DisplayListProps) {
  var displayItemList: JSX.Element[] = [];
  props.items.forEach((value, key, map) => {
    displayItemList.push(<DisplayItem key={key.toString()}
                                      item={value}
                                      onCheckboxChange={props.onCheckboxChange}/>)
  })
  return (
    <ul style={{listStyle: "none"}}>
      {displayItemList}
    </ul>
  );
}

type TotalItemCountProps = {
  total: number;
  completed: number;
}

function DisplayTotalItemCount(props: TotalItemCountProps) {
  return (
    <>
      <p>Items completed: {props.completed}</p>
      <p>Total items: {props.total}</p>
    </>
  );
}

type NewItemInputProps = {
  onNewItemTextChange: CallableFunction;
  onSubmit: CallableFunction;
  newItemText: string;
}

class NewItemInput extends React.Component<NewItemInputProps> {
  constructor(props: NewItemInputProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.props.onNewItemTextChange(event.target.value);
  }

  handleSubmit(event: FormEvent) {
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

type TodoItem = {
  text: string;
  dueDate?: Date;
  dateCreated: number;
  isDone: boolean;
}

type TodoListState = {
  items: Map<number, TodoItem>;
  newItemText: string;
  error?: string;
}

class TodoList extends React.Component<{}, TodoListState> {
  constructor(props: {}) {
    super(props);

    this.state = {items: new Map<number, TodoItem>(), newItemText: ""};

    this.onNewItemTextChange = this.onNewItemTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3000/todos")
      .then(res => res.json())
      .then(
        (result) => {
          var items: Map<number, TodoItem> = new Map<number, TodoItem>();
          result.forEach((object: TodoItem) => {
            items.set(object.dateCreated, object);
          });

          this.setState({
            items: items,
            newItemText: "",
          });

        },
        (error) => {
          this.setState({
            items: new Map<number, TodoItem>(),
            newItemText: "",
            error: error,
          });
        }
      )
  }

  onNewItemTextChange(value: string) {
    this.setState((state, props) => ({
      newItemText: value
    }));
  }

  onSubmit() {
    this.setState((state) => {
      var timeInMs: number = new Date().getTime();
      state.items.set(timeInMs, {dateCreated: timeInMs, text: state.newItemText, isDone: false});
      return {
        items: state.items,
        newItemText: ""
      };
    });
  }

  onCheckboxChange(key: number, isChecked: boolean) {
    this.setState((state) => {
      var itemInfo: TodoItem = state.items.get(key)!;
      itemInfo.isDone = isChecked;
      state.items.set(key, itemInfo)
      return {
        items: state.items
      }
    });
  }

  render() {
    if (this.state.error) {
      console.log(this.state.error);
      // todo handle the error better here
    }

    var itemsCompleted: number = 0;
    this.state.items.forEach((value, key, map) => {
      if (value.isDone) {
        itemsCompleted++;
      }
    });
    
    return (
      <div>
        <h1>My ToDo List</h1>
        <>
          <NewItemInput onNewItemTextChange={this.onNewItemTextChange}
                        onSubmit={this.onSubmit}
                        newItemText={this.state.newItemText} />
          <DisplayTotalItemCount total={this.state.items.size}
                                 completed={itemsCompleted} />
          <DisplayList onCheckboxChange={this.onCheckboxChange}
                       items={this.state.items} />
        </>
      </div>
    );
  }
}

export default TodoList;
