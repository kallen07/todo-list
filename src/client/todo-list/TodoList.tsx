import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Task } from 'src/types';

type DisplayItemProps = {
  item: Task;
  onCheckboxChange: CallableFunction;
}

function DisplayItem(props: DisplayItemProps) {

  const handleItemChecked = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    props.onCheckboxChange(props.item.id, target.checked)
  }

  return(
    <li>
      <input type="checkbox"
              checked={props.item.isDone}
              onChange={handleItemChecked}/>
      {props.item.text}<br/>
      {"date created:" + props.item.dateCreated}
    </li>
  );
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

function NewItemInput(props: NewItemInputProps) {

  const handleChange = (event: ChangeEvent<HTMLInputElement>)  => {
    props.onNewItemTextChange(event.target.value);
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    props.onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Wash the laundry..."
        value={props.newItemText}
        onChange={handleChange} />
      <input type="submit" value="Submit"/>
    </form>
  );
}

type taskMap = Map<string, Task>;

function TodoList() {

  const [tasks, updateTasks] = useState<taskMap>(new Map<string, Task>());
  const [newItemText, updateNewItemText] = useState<string>("");

  const getTasks = () => {
    fetch("http://localhost:3000/tasks")
      .then(res => res.json())
      .then(
        (taskList) => {
          const tasksFromServer: Map<string, Task> = new Map<string, Task>();
          taskList.forEach((object: Task) => {
            tasksFromServer.set(object.id, object);
          });

          updateTasks(tasksFromServer);
        },
        (error) => {
          console.log(error)
        }
      )
  }

  const postTask = () => {
    const currDate: Date = new Date();

    const newTask: Task = {
      id: "",
      text: newItemText,
      isDone: false,
      dateCreated: currDate,
    };

    fetch("http://localhost:3000/tasks", {
      method: 'POST',
      body: JSON.stringify(newTask),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    .then(response => response.json())
    .then(task => {
      console.log("saved new task to mongodb: " + JSON.stringify(newTask));
      console.log("the new task id is " + task.id);

      updateTasks(tasks => {
        const newTasks: Map<string, Task> = new Map(tasks);
        newTasks.set(task.id, task);
        return newTasks;
      });
    });

    updateNewItemText("");
  }

  const putTask = (task: Task) => {
    fetch("http://localhost:3000/tasks/" + task.id, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then(response => response.json())
      .then(taskFromServer => {
        console.log("updated task in mongodb: " + JSON.stringify(taskFromServer));
        updateTasks(tasks => {
          const newTasks = new Map(tasks);
          newTasks.set(taskFromServer.id, taskFromServer);
          return newTasks;
        })
      });
  }

  const onCheckboxChange = (key: string, isChecked: boolean) => {
    var task: Task = tasks.get(key)!;
    task.isDone = isChecked;

    putTask(task);
  }

  const computeItemCompleted = (): number => {
   let itemsCompleted: number = 0;
    tasks.forEach((value) => {
      if (value.isDone) {
        itemsCompleted++;
      }
    });
    return itemsCompleted;
  }

  useEffect(getTasks, []);

  return (
    <div>
      <h1>My ToDo List</h1>
      <>
        <NewItemInput onNewItemTextChange={updateNewItemText}
                      onSubmit={postTask}
                      newItemText={newItemText} />
        <DisplayTotalItemCount total={tasks.size}
                                completed={computeItemCompleted()} />
        <DisplayList onCheckboxChange={onCheckboxChange}
                     items={tasks} />
      </>
    </div>
  );
}

export default TodoList;
