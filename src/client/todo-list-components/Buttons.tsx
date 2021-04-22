import styled from 'styled-components';

const Button = styled.button`
  background-color: white;
  color: dodgerblue;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid dodgerblue;
  border-radius: 3px;
`;

const WarningButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

const SubmitButton = styled(Button)`
  color: seagreen;
  border-color: seagreen;
`;

export { Button, WarningButton, SubmitButton };
