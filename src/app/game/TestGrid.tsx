import React from 'react';
import './Grid.css';
import { GridTile } from './GridTile';
import { Tile, TileType } from '../../types/types';

function TestGrid() {

  const mockTile:Tile = {
    guess: 'h',
    value: 'a',
    coordinates: {
      x: 0,
      y: 0
    }
  };
    
  return (
    <div className='word-container'>
      <GridTile tile={mockTile} tileType={TileType.Empty} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.Head} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.HeadEast} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.HeadNorth} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.HeadSouth} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.HeadWest} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.Horizontal} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.Vertical} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.CornerNorthEast} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.CornerNorthWest} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.CornerSouthEast} onClickCallback={()=> console.log('Clicked')}/>
      <GridTile tile={mockTile} tileType={TileType.CornerSouthWest} onClickCallback={()=> console.log('Clicked')}/>
    </div>
  );
}

export default TestGrid;
