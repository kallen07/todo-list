import React, { useState, useEffect } from 'react';
import { Task } from 'src/types';
import DisplayList from './DisplayList';
import DisplayTotalItemCount from './DisplayTotalItemCount';
import NewItemInput from './NewItemInput';

// This code is very ugly, basically compares to ensure that
// if both tasks are finished then the most recently completed task comes first
// if both tasks are unfinished then the most recently created task comes first
// unfinished tasks come before finished tasks
const compareTasks = (task1 : Task, task2 : Task) => {
  if (task1.isDone && task2.isDone) {
    // use the non-null assertion operator (!) to prevent typing error
    return task1.dateCompleted! >= task2.dateCompleted! ? -1 : 1;
  } else if (!task1.isDone && !task2.isDone) {
    return task1.dateCreated >= task2.dateCreated ? -1 : 1;
  }
  return task1.isDone ? 1 : -1;
};


function TodoList() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newItemText, setNewItemText] = useState<string>("");

  const getTasks = () => {
    fetch("/tasks")
      .then(res => res.json())
      .then(
        (taskList) => {
          setTasks(taskList.sort(compareTasks));
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
      dateCompleted: null,
    };

    fetch("/tasks", {
      method: 'POST',
      body: JSON.stringify(newTask),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    .then(response => response.json())
    .then(newTask => {
      console.log("saved new task to mongodb: " + JSON.stringify(newTask));
      console.log("the new task id is " + newTask.id);

      setTasks([newTask, ...tasks])
    });

    setNewItemText("");
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
        const updatedTasks : Task[] = tasks.filter(t => t.id != taskFromServer.id)
        updatedTasks.push(taskFromServer)
        //tasks.slice(0, index).concat(newTaskArray, tasks.slice(index + 1));
        setTasks(updatedTasks.sort(compareTasks));
      });
  }

  const deleteTasks = (ids: String[]) => {
    fetch("/tasks", {
      method: "DELETE",
      body: JSON.stringify(ids),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    .then(response => {
      if (response.status === 200) {
        setTasks(tasks.filter(t => !ids.includes(t.id)));
      } else {
        console.log("!!!! TASK DELETION FAILED", response)
      }
    })
  }

  const clearCompletedTasks = () => {
    const completedTasks : Task[] = tasks.filter(t => t.isDone)
    const taskids = completedTasks.map(t => t.id);
    deleteTasks(completedTasks.map(t => t.id));
  }

  const onCheckboxChange = (key: string, isChecked: boolean) => {
    var task: Task = tasks.find(t => t.id === key)!;
    task.isDone = isChecked;
    task.dateCompleted = isChecked? new Date() : null;

    putTask(task);
  }

  const computeItemCompleted = (): number => {
   let itemsCompleted: number = 0;
    tasks.forEach(t => {
      if (t.isDone) {
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
        <NewItemInput onNewItemTextChange={setNewItemText}
                      onSubmit={postTask}
                      newItemText={newItemText} />
        <DisplayTotalItemCount total={tasks.length}
                               completed={computeItemCompleted()} />
        <DisplayList onCheckboxChange={onCheckboxChange}
                     items={Array.from(tasks.values())} />
        <button onClick={clearCompletedTasks}>Clear Completed</button>
      </>
    </div>
  );
}

export default TodoList;
