import React from "react";
// Importando os components necessários da lib react-materialize
import { Row, Col, Card } from 'react-materialize';

const About = () => (
     <Row>
          <Col m={3} s={12}>
               {/* <UserProfile /> */}
          </Col>
          <Col m={8} s={12}>
               <h5 className="subtitle">Sobre o App</h5>
               <Card>
                    <div>
                         <p><b>TODO SPA</b></p>
                         <p>Simple Page Application, com o objetivo de guardar notas do usuário.</p>
                         <br />
                         <p><b>Criador por</b></p>
                         <p>João Gabriel Quaresma.</p>
                         <br />
                    </div>
               </Card>
          </Col>
     </Row>
);

export default About;