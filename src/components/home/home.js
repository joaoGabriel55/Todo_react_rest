import React from "react";

import { Button, Table, Icon, Card, Input } from "react-materialize";

import axios from 'axios'

import AddItem from './../addItem/addItem'

//const URL = 'https://todo-jsf-spring.herokuapp.com/item';
const URL = 'http://localhost:8080/item';


export default class Home extends React.Component {

     constructor(props) {
          super(props);
          this.state = {
               items: [],
               isLoading: true
          };
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
               this.setState({ items, isLoading: false });
          }).catch(error => console.log('parsing failed', error))

          console.log(this.state.items)
          return this.state.items
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

     async setStatus(item) {
          console.log(item);

          if(item.status)
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


     render() {
          return (
               <div>
                    <br />
                    <Card className='white' textClassName='white' >
                         <AddItem />

                         <Table>
                              <thead>
                                   <tr>
                                        <th width="5%" data-field="checkStatus"></th>
                                        <th width="80%" data-field="price"></th>
                                        <th width="10%" data-field="delete"></th>
                                   </tr>
                              </thead>

                              <tbody>
                                   {this.state.items.map(item =>
                                        <tr key={item.id}>
                                             <td> <Input name='group1' type='checkbox' checked={item.status} label=' ' onClick={()=>this.setStatus(item)}/> </td>
                                             <td> {item.nome}</td>
                                             <td>
                                                  <Button className='btn-flat' onClick={() => this.remove(item.id)} size="sm">
                                                       <Icon >delete</Icon>
                                                  </Button>
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </Table>
                    </Card>
               </div>
          );
     }
}