import React from 'react';
import './Grid.css';

function TestGrid() {

  function SnakeTile(){
    return (
      <div className='tile snake-container'>
        <div className='snake-head north-end'>h</div>
      </div>
    );
  }
      
    
  return (
    <div className='word-container'>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head south-end'></div>
      </div>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head north-end'></div>
      </div>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head east-end'></div>
      </div>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head west-end'></div>
      </div>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head vertical-through'></div>
      </div>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head horizontal-through'></div>
      </div>
      <div className='tile snake-container'>
        <button className='inner-square' onClick={()=> {console.log('clicked');}}>
          <span className='tile-letter' >h</span>
        </button>
        <div className='snake-head corner-through'>
          <div className='corner'>
            <div className='inner'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestGrid;
