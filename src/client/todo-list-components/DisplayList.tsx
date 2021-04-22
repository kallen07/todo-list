import React from 'react';
import styled from 'styled-components';
import { Task } from 'src/types';
import DisplayItem from './DisplayItem';

type DisplayListProps = {
  items: Array<Task>;
  onCheckboxChange: CallableFunction;
}

const List = styled.ul`
  padding: 0;
  margin: 25px 0;
`;


function DisplayList(props: DisplayListProps) {
  var displayItemList: JSX.Element[] = [];
  props.items.forEach((task) => {
    displayItemList.push(<DisplayItem key={task.id.toString()}
                                      item={task}
                                      onCheckboxChange={props.onCheckboxChange}/>)
  })
  return (
    <List style={{listStyle: "none"}}>
      {displayItemList}
    </List>
  );
}

export default DisplayList;
