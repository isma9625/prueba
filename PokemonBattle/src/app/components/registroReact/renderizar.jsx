import React from 'react';
import ReactDOM from 'react-dom/client';
import Registro from './registro.jsx';


export const renderizarRegistro = (element) => {
  console.log('Renderizando Registro en el elemento:', element);
  console.log('Renderizando Registro');
  const root = ReactDOM.createRoot(element);
  root.render(<Registro />);
};