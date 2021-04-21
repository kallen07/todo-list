import React from 'react';
import { Task } from 'src/types';
import DisplayItem from './DisplayItem';

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

export default DisplayList;
