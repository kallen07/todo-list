import React, { FormEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { SubmitButton } from './Buttons';

const TextInput = styled.input`
  padding: 0.25em;
  margin-right: 0.25em;
`;

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
      <TextInput
        type="text"
        placeholder="Wash the laundry..."
        value={props.newItemText}
        onChange={handleChange} />
      <SubmitButton type="submit">Submit</SubmitButton>
    </form>
  );
}

export default NewItemInput;
