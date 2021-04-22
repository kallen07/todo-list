import React from 'react';
import styled from 'styled-components';

type TotalItemCountProps = {
  total: number;
  completed: number;
}

function DisplayTotalItemCount(props: TotalItemCountProps) {
  return (
    <div>
      <p>{props.completed} out of {props.total} completed</p>
    </div>
  );
}

export default DisplayTotalItemCount;
