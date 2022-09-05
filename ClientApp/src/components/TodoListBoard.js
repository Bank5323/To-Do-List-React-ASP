import React, { Component } from 'react';
import Board from 'react-trello';

export class TodoList extends Component {
  static displayName = TodoList.name;

  constructor(props) {
    super(props);
    this.state = { todoinprogress: [], todonotinprogress: [], loading: true };
  }

  componentDidMount() {
    this.populateTodoListData();
  }

  static renderTodoListTable(todonotinprogress, todoinprogress) {
    const data = {
      lanes: [
        {
          id: 'lane1',
          title: 'Task',
          cards: todonotinprogress
        },
        {
          id : 'lane2',
          title: 'In Progress',
          cards: todoinprogress
        }
      ]
    }
    return <Board
      data={data}
      style={{backgroundColor: '#fff'}}
    />;
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : TodoList.renderTodoListTable(this.state.todonotinprogress, this.state.todoinprogress);

    return (
      <div>
        <h1 id="tabelLabel" >TodoList Item</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateTodoListData() {
    const response_in = await fetch('api/todolist/inprogress');
    const data_inprogress = await response_in.json();
    const response = await fetch('api/todolist/notinprogress');
    const data_notinprogress = await response.json();
    this.setState({ todoinprogress: data_inprogress,
       todonotinprogress: data_notinprogress,
        loading: false });
  }
}
