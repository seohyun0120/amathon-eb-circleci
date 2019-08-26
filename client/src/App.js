import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: []
    }
  }
  getToDo = async () => {
    try {
      const response = await axios.get('/todos');
      console.log('response data: ', response.data)
      this.setState({
        todoList: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    console.log(this.state.todolist)
    const todos = this.state.todoList
    return (
      <div className='App'>
        <h1>Hello Stranger?</h1>
        <button onClick={this.getToDo}>
          TODO
        </button>
        <div>
          {todos.map(todo => (
            <h3 key={todo.id}>
              제목: {todo.title}<br/>설명: {todo.description}
            </h3>
          ))}
        </div>
        <h1>Thank you :) </h1>
      </div>
    )
  }
}

export default App;