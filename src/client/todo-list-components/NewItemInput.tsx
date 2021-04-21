import React, { FormEvent, ChangeEvent } from 'react';

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

export default NewItemInput;
