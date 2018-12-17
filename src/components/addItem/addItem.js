import React from "react";

import { Input, Row, Button } from "react-materialize";

import URL from "./../urlservice"

export default class AddItem extends React.Component {

     render() {
          const { onSubmit, item, onChange } = this.props;
          return (
               <form onSubmit={onSubmit}>
                    <Row>
                         <Input s={11} type="text" name="name" onChange={onChange} value={item.nome}
                              label="O que você precisa fazer?" />
                         <div>
                              <Button s={1} floating large className='green' waves='light' icon='add' type="submit" />
                         </div>
                    </Row>
               </form>
          )
     }
}