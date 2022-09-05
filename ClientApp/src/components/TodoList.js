import React, { Component } from 'react';

export class TodoList extends Component {
  static displayName = TodoList.name;

  constructor(props) {
    super(props);
    this.state = { todoitems: [], loading: true };
  }

  componentDidMount() {
    this.populateTodoListData();
  }

  static renderTodoListTable(todoitems) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {todoitems.map(todoitem =>
            <tr key={todoitem.id}>
              <td>{todoitem.releaseDate}</td>
              <td>{todoitem.title}</td>
              <td>{todoitem.status.toString()}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : TodoList.renderTodoListTable(this.state.todoitems);

    return (
      <div>
        <h1 id="tabelLabel" >TodoList Item</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateTodoListData() {
    const response = await fetch('api/todolist');
    const data = await response.json();
    this.setState({ todoitems: data, loading: false });
  }
}
