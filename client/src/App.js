import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: {}
    }
  }

  getToDo = async () => {
    try {
      const response = await axios.get('/todo');
      this.setState({
        todo: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        <h1>Hello Stranger?</h1>
        <button onClick={this.getToDo}>
          TODO
        </button>
        <h3>name: {this.state.todo.name}</h3>
        <h4>description: {this.state.todo.description}</h4>
      </div>
    )
  }

}

export default App;
