import { TileType } from '../../../types/types';

export function getClassFromTileType(tileType: TileType){
  switch(tileType){
  case(TileType.Head):
    return 'end';
  case(TileType.HeadNorth):
    return 'north-end';
  case(TileType.HeadSouth):
    return 'south-end';
  case(TileType.HeadEast):
    return 'east-end';
  case(TileType.HeadWest):
    return 'west-end';
  case(TileType.Vertical):
    return 'vertical-through';
  case(TileType.Horizontal):
    return 'horizontal-through';
  case(TileType.CornerNorthEast):
    return 'bend north-east';
  case(TileType.CornerNorthWest):
    return 'bend north-west';
  case(TileType.CornerSouthEast):
    return 'bend south-east';
  case(TileType.CornerSouthWest):
    return 'bend south-west';
  default:
    return '';
  }
}