import React from 'react';
import ReactDOM from 'react-dom/client';
import Registro from './registro';


export const renderizarRegistro = (element: Element) => {
  const root = ReactDOM.createRoot(element);
  root.render(<Registro />);
};