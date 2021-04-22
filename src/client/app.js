import React from 'react';
import styled from 'styled-components';
import TodoList from './todo-list-components/TodoList';

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  font-family: 'Nunito', sans-serif;
  padding: 40px 0;
  max-width: 400px;
`;

const App = () => {
  return (
    <FlexContainer>
      <Container>
        <TodoList/>
      </Container>
    </FlexContainer>
  );
}

export default App;
