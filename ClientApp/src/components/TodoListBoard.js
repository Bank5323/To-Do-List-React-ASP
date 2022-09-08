import React, { Component } from 'react';
import Board from 'react-trello';
import update from 'immutability-helper'

export class TodoList extends Component {
  static displayName = TodoList.name;

  constructor(props) {
    super(props);
    this.state = {draggedData: [], boardData: [], loading: true };
  }

  componentDidMount() {
    this.populateTodoListData();
  }

  updataTodoitemAPI = (todoListID, metadata) =>{
    var api_url = "api/TodoList/"+todoListID;
    const requestOpt = {
      method: 'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(metadata)
    };
    fetch(api_url,requestOpt);
  }

  updateBoard = newData => {
    this.setState({draggedData: newData});
  }

  onDragEnd = (cardId, sourceLandId, targetLaneId, card) => {
    const {draggedData} = this.state;
    const laneIndex = draggedData.lanes.findIndex(lane => lane.id === sourceLandId);
    const cardIndex = draggedData.lanes[laneIndex].cards.findIndex(card => card.id === cardId);
    var metaDatacard = draggedData.lanes[laneIndex].cards[cardIndex].metadata;
    metaDatacard.status = !metaDatacard.status;
    const updatedData = update(draggedData, {lanes: {[laneIndex]: {cards: {[cardIndex]: {metadata: {$set: metaDatacard}}}}}});

    this.updataTodoitemAPI(metaDatacard.id,metaDatacard);
    this.setState({boardData: updatedData});
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : <Board
      data={this.state.boardData}
      style={{backgroundColor: '#fff'}}
      onDataChange={this.updateBoard}
      handleDragEnd={this.onDragEnd}
    />;

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

    const data = {
      lanes: [
        {
          id: 'lane1',
          title: 'Task',
          cards: data_notinprogress
        },
        {
          id : 'lane2',
          title: 'In Progress',
          cards: data_inprogress
        }
      ]
    }

    this.setState({ boardData: data,
        loading: false });
  }
}
