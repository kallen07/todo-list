import React from 'react';

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

export default DisplayTotalItemCount;
