import React, { ChangeEvent } from 'react';
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

export default DisplayItem;
