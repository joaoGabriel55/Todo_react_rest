import React from "react";

import qs from "qs";

import { Input, Row, Button, Icon } from "react-materialize";

import axios from 'axios'

export default class AddItem extends React.Component {

     initItem = {
          nome: '',
          status: false
     };

     constructor(props) {
          super(props);
          this.state = {
               item: this.initItem
          };
          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
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

     async handleSubmit(event) {
          event.preventDefault();
          const item = this.state.item;

          console.log(item);

          await fetch('http://localhost:8080/item', {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(item),
          }).then(res => {
               console.log(res.status)
          });

          window.location.reload()

     }

     render() {
          const { item } = this.state;
          return (
               <form onSubmit={this.handleSubmit}>
                    <Row>
                         <Input s={11} type="text" name="name" onChange={this.handleChange} value={item.nome}
                              label="O que você precisa fazer?" />
                         <div>
                              <Button s={1} floating large className='green' waves='light' icon='add' type="submit" />
                         </div>
                    </Row>
               </form>
          )
     }
}