import React, { Component } from 'react';
import Board from 'react-trello';
import update from 'immutability-helper'

export class TodoList extends Component {
  static displayName = TodoList.name;

  constructor(props) {
    super(props);
    this.state = { boardData: [], loading: true, isCreate: false, tmpCreate: []};
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
    const requestOpt = {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(card)
    };
    fetch(api_url,requestOpt);
  }

  updateBoard = newData => {
    this.setState({boardData: newData});
    if(this.state.isCreate === true){
      this.updateCreate(this.state.tmpCreate);
    }
  }

  updateCreate = () =>{
    const {boardData} = this.state;
    const laneIndex = boardData.lanes.findIndex(lane => lane.id === this.state.tmpCreate.laneId);
    const cardIndex = boardData.lanes[laneIndex].cards.findIndex(card => card.id === this.state.tmpCreate.cardId);
    const updatedData = update(boardData, {lanes: {[laneIndex]: {cards: {[cardIndex]: {$set: this.state.tmpCreate.card}}}}});
    this.setState({boardData: updatedData, isCreate: false, tmpCreate: []});
  }

  onCardAdd = (card, laneId) => {
    var cardId = card.id;
    card.state = true;
    if (laneId === "lane1"){
      card.state = false;
    }
    this.adddataTodotiemAPI(card);
    this.setState({isCreate: true, tmpCreate: {cardId: cardId, laneId: laneId, card: card}});
  }

  onDragEnd = (cardId, sourceLandId, targetLaneId) => {
    if(sourceLandId !== targetLaneId){
      const {boardData} = this.state;
      const laneIndex = boardData.lanes.findIndex(lane => lane.id === sourceLandId);
      const cardIndex = boardData.lanes[laneIndex].cards.findIndex(card => card.id === cardId);
      var card = boardData.lanes[laneIndex].cards[cardIndex];
      card.state = !card.state;
      const updatedData = update(boardData, {lanes: {[laneIndex]: {cards: {[cardIndex]: {$set: card}}}}});
      this.updataTodoitemAPI(cardId,card);
      this.setState({boardData: updatedData});
    }
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
      laneDraggable={false}
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
