import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Task } from 'src/types';

interface StyledItemProps {
  readonly isDone: boolean;
};

const StyledItem = styled.li<StyledItemProps>`
  color: ${props => props.isDone ? "grey" : "black"};
  padding: 5px 0;
`;

const StyledCheckbox = styled.input`
  margin-right: 10px;
`;

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
    <StyledItem isDone={props.item.isDone}>
      <StyledCheckbox type="checkbox"
                      checked={props.item.isDone}
                      onChange={handleItemChecked}/>
      {props.item.text}
    </StyledItem>
  );
}

export default DisplayItem;
