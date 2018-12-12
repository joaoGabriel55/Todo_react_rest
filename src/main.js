import React from "react";
// Importando o component Home
import Home from "./components/home/home";

// Importando o component About
import About from "./components/about/about";

// Importando os components necessários da lib react-materialize
import { Container } from 'react-materialize';

import { Switch, Route } from 'react-router-dom'

const Main = () => (
     <main>
          <Container>
               <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/about' component={About} />
               </Switch>
          </Container>
     </main>
);

export default Main;