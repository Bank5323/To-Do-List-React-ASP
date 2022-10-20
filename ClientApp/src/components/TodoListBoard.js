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

  updataTodoitemAPI = (cardID, card) =>{
    var api_url = "api/TodoList/"+cardID;
    const requestOpt = {
      method: 'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(card)
    };
    fetch(api_url,requestOpt);
  }

  adddataTodotiemAPI = (card) => {
    var api_url = "api/TodoList";
    console.log(card);
    const requestOpt = {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(card)
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
    var metaDatacard = draggedData.lanes[laneIndex].cards[cardIndex];
    metaDatacard.state = !metaDatacard.state;
    console.log(metaDatacard);
    const updatedData = update(draggedData, {lanes: {[laneIndex]: {cards: {[cardIndex]: {$set: metaDatacard}}}}});

    this.updataTodoitemAPI(metaDatacard.id,metaDatacard);
    this.setState({boardData: updatedData});
  }

  onCardAdd = (card, laneId) => {
    if (laneId === "lane1"){
      card.state = false
    }else{
      card.state = true
    }
    this.adddataTodotiemAPI(card);
  }
  onCardDelete = (cardId, laneId) => {
    fetch('api/todolist/'+cardId,{method: 'DELETE'});
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : <Board
      data={this.state.boardData}
      style={{backgroundColor: '#fff'}}
      onDataChange={this.updateBoard}
      handleDragEnd={this.onDragEnd}
      onCardAdd={this.onCardAdd}
      onCardDelete={this.onCardDelete}
      draggable={true}
      editable={true}
      components={{AddCardLink: ({onClick, t}) => <button onClick={onClick}>{t('Click to add card')}</button>}}
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
