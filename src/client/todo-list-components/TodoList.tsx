import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Task } from 'src/types';
import DisplayList from './DisplayList';
import DisplayTotalItemCount from './DisplayTotalItemCount';
import NewItemInput from './NewItemInput';

type taskMap = Map<string, Task>;

function TodoList() {

  const [tasks, updateTasks] = useState<taskMap>(new Map<string, Task>());
  const [newItemText, updateNewItemText] = useState<string>("");

  const getTasks = () => {
    fetch("/tasks")
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

    fetch("/tasks", {
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
    fetch("/tasks/" + task.id, {
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