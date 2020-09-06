import React, { FormEvent, ChangeEvent } from 'react';
import { Task } from 'src/types';

type DisplayItemProps = {
  item: Task;
  onCheckboxChange: CallableFunction;
}

class DisplayItem extends React.Component<DisplayItemProps> {
  constructor(props: DisplayItemProps) {
    super(props);
    this.handleItemChecked = this.handleItemChecked.bind(this);
  }

  handleItemChecked(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    this.props.onCheckboxChange(this.props.item.id, target.checked)
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
  items: Map<string, Task>;
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

type TodoListState = {
  items: Map<string, Task>;
  newItemText: string;
  error?: string;
}

class TodoList extends React.Component<{}, TodoListState> {
  constructor(props: {}) {
    super(props);

    this.state = {items: new Map<string, Task>(), newItemText: ""};

    this.onNewItemTextChange = this.onNewItemTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3000/tasks")
      .then(res => res.json())
      .then(
        (result) => {
          var items: Map<string, Task> = new Map<string, Task>();
          result.forEach((object: Task) => {
            items.set(object.id, object);
          });

          this.setState({
            items: items,
            newItemText: "",
          });

        },
        (error) => {
          this.setState({
            items: new Map<string, Task>(),
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
    const currDate: Date = new Date();
    var newTask: Task;
    this.setState((state) => {
      newTask = {
        id: currDate.getTime().toString(),  // temporary client-generated ID
        text: state.newItemText,
        isDone: false,
        dateCreated: currDate,
      };

      state.items.set(newTask.id, newTask);
      return {
        items: state.items,
        newItemText: ""
      };
    }, () => {
      fetch("http://localhost:3000/tasks", {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log("saved new task to mongodb: " + JSON.stringify(newTask));
        console.log("the new task id is " + json.id);
        this.setState((state) => {
          // set permanent server-generated ID
          newTask.id = json.id;
          state.items.delete(currDate.getTime().toString());
          state.items.set(json.id, newTask);
        });
      });
    });
  }

  onCheckboxChange(key: string, isChecked: boolean) {
    var task: Task;
    this.setState((state) => {
      task = state.items.get(key)!;
      task.isDone = isChecked;
      state.items.set(key, task)
      return {
        items: state.items
      }
    }, () => {
      fetch("http://localhost:3000/tasks/" + task.id, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log("updated task in mongodb: " + JSON.stringify(task));
      });
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
