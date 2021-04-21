import React from 'react';
import { Task } from 'src/types';
import DisplayItem from './DisplayItem';

type DisplayListProps = {
  items: Array<Task>;
  onCheckboxChange: CallableFunction;
}

function DisplayList(props: DisplayListProps) {
  var displayItemList: JSX.Element[] = [];
  props.items.forEach((task) => {
    displayItemList.push(<DisplayItem key={task.id.toString()}
                                      item={task}
                                      onCheckboxChange={props.onCheckboxChange}/>)
  })
  return (
    <ul style={{listStyle: "none"}}>
      {displayItemList}
    </ul>
  );
}

export default DisplayList;
