import React from "react";

import { Button, Table, Icon, Card, Input, Row } from "react-materialize";

import axios from 'axios'

import AddItem from './../addItem/addItem'

import URL from "./../urlservice"

const filterActive = (item) => item.status === false
const filterCompleted = (item) => item.status === true

export default class Home extends React.Component {

     initItem = {
          nome: '',
          status: false
     };

     constructor(props) {
          super(props);
          this.state = {
               items: [],
               itemsFilted: [],
               isLoading: true,
               item: this.initItem
          };
          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
     }

     componentWillMount() {
          localStorage.getItem('items') && this.setState({
               items: JSON.parse(localStorage.getItem('items')),
               isLoading: false
          })
     }

     componentDidMount() {
          const date = localStorage.getItem('itemsDate');
          const itensDate = date && new Date(parseInt(date));
          const now = new Date();

          const dataAge = Math.round((now - itensDate) / (1000 * 60)); // in minutes
          const tooOld = dataAge >= 1;

          //          console.log(localStorage.getItem('items').length)
          console.log(this.fetchData().length)

          if (tooOld || this.fetchData().length > localStorage.getItem('items').length) {
               this.fetchData();
          } else {
               console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
          }
     }


     fetchData() {
          axios.get(URL).then(res => {
               const items = res.data;
               this.setState({ items, itemsFilted: items, isLoading: false });
          }).catch(error => console.log('parsing failed', error))

          console.log(this.state.items)
          return this.state.items
     }

     fetchDataFilted(filter) {

          console.log(filter)
          console.log(this.itemsFilted + "AQQQQ")

          let array = this.state.items

          if (filter === 0) {
               this.fetchData()
          } else if (filter === 1) {
               let arrayAtived = array.filter(filterActive);
               this.setState({ itemsFilted: arrayAtived });
          } else if (filter === 2) {
               let arrayCompleted = array.filter(filterCompleted);
               this.setState({ itemsFilted: arrayCompleted });
          }


          console.log(this.state.items + "ARRAY")
     }

     async remove(id) {
          await fetch(`${URL}/${id}`, {
               method: 'DELETE',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
               }
          }).then(() => {
               this.fetchData();
          });
     }


     async cleanCompletedItems() {
          this.state.items.forEach(item => {
               if (item.status)
                    this.remove(item.id)
          });
     }

     async setStatus(item) {
          console.log(item);

          if (item.status)
               item.status = false
          else
               item.status = true

          await fetch(`${URL}`, {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(item),
          }).then(() => {
               this.fetchData();
          });
     }


     componentWillUpdate(nextProps, nextState) {
          localStorage.setItem('items', JSON.stringify(nextState.items));
          localStorage.setItem('itemsDate', Date.now());
     }

     renderQtdItemAtivos() {

          let sizeList = this.state.items.filter(filterActive).length;
          let sizeListCompleted = this.state.items.filter(filterCompleted).length;//Tamanho da Lista de items completados

          if (this.state.items.length !== 0) {
               return (
                    this.componentToolBarFilter(sizeList, sizeListCompleted)
               )
          } else {
               return null
          }

     }

     componentToolBarFilter(sizeList, sizeListCompleted) {
          return (
               <Row>
                    <span>Há {sizeList} item(s) restantes</span>
                    <Button id="btnGroupFilter" className='btn-flat' waves='light' onClick={() => this.fetchDataFilted(0)} >Todos</Button>
                    <Button id="btnGroupFilter" className='btn-flat' waves='light' onClick={() => this.fetchDataFilted(1)} >Ativos</Button>
                    <Button id="btnGroupFilter" className='btn-flat' waves='light' onClick={() => this.fetchDataFilted(2)} >Completados</Button>
                    {this.componentClear(sizeListCompleted)}
               </Row>
          )
     }

     componentClear(sizeListCompleted) {
          if (sizeListCompleted > 0) {
               return (
                    <Button id="btnClean" s={1} className='btn-flat' waves='light' onClick={() => this.cleanCompletedItems()} >Limpar itens completados</Button>
               )
          } else {
               return null
          }
     }


     async handleSubmit(event) {
          event.preventDefault();
          const item = this.state.item;

          console.log(item);

          await fetch(URL, {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(item),
          }).then(res => {
               this.setState({item: this.initItem})
               this.fetchData()
               console.log(res.status)
          });
     }

     handleChange(event) {
          const target = event.target;
          const value = target.value;

          console.log(value)

          const item = {
               nome: value,
               status: false
          }
          this.setState({ item });
          console.log(this.state.item)
     }

     render() {
          return (
               <div>
                    <br />
                    <Card className='white' textClassName='white' >
                         <AddItem onSubmit={this.handleSubmit} onChange={this.handleChange} item={this.state.item} />

                         <Table>
                              <thead>
                                   <tr>
                                        <th width="5%" data-field="checkStatus"></th>
                                        <th width="80%" data-field="price"></th>
                                        <th width="10%" data-field="delete"></th>
                                   </tr>
                              </thead>

                              <tbody>
                                   {this.state.itemsFilted.map(item =>
                                        <tr key={item.id}>
                                             <td> <Input name='group1' type='checkbox' checked={item.status} label=' ' onClick={() => this.setStatus(item)} /> </td>
                                             <td> {item.nome} </td>
                                             <td>
                                                  <Button className='btn-flat' onClick={() => this.remove(item.id)} size="sm">
                                                       <Icon >delete</Icon>
                                                  </Button>
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </Table>
                         <hr />
                         {this.renderQtdItemAtivos()}
                    </Card>
               </div>
          );
     }
}