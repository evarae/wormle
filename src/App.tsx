import React from 'react';
import './App.css';
import Grid from './game/Grid';
import TestGrid from './game/TestGrid';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          WORMLE
        </h1>
      </header>
      <Grid/>
      <TestGrid/>
    </div>
  );
}

export default App;
