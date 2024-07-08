import { Cardinal } from "./GameEngine";
import { Coordinates, TileType } from "../types/types";

export function getTileTypeForPathIndex(index: number, path:Coordinates[]): TileType{
  if(index >= path.length){
    return TileType.Empty;
  }

  const c = path[index];

  const last = (index -1 >= 0)? getCardinalOfAdjacentCoordinates(c, path[index-1]) : undefined;
  const next = (index +1 <= path.length - 1) ? getCardinalOfAdjacentCoordinates(c, path[index+1]) : undefined;

  return getTileTypeFromAdjacentPathTiles(next, last);
}

function getCardinalOfAdjacentCoordinates(from:Coordinates, to:Coordinates) : Cardinal {
  const diffX = (from.x - to.x);
  const diffY = (from.y - to.y);

  if(diffX == 1 && diffY == 0){
    return Cardinal.West;
  } 

  if(diffX == -1 && diffY == 0){
    return Cardinal.East;
  } 

  if(diffX == 0 && diffY == 1){
    return Cardinal.North;
  } 

  return Cardinal.South;
}

function getTileTypeFromAdjacentPathTiles(next: Cardinal | undefined, last: Cardinal | undefined) : TileType {
  if(next === undefined && last === undefined){
    return TileType.Head;
  }

  if(next === undefined && last === Cardinal.North || last === undefined && next === Cardinal.North){
    return TileType.HeadNorth;
  }
  
  if(next === undefined && last === Cardinal.South || last === undefined && next === Cardinal.South){
    return TileType.HeadSouth;
  }

  if(next === undefined && last === Cardinal.East || last === undefined && next === Cardinal.East){
    return TileType.HeadEast;
  }

  if(next === undefined && last === Cardinal.West || last === undefined && next === Cardinal.West){
    return TileType.HeadWest;
  }

  if(next === Cardinal.East && last === Cardinal.West || last === Cardinal.East && next === Cardinal.West){
    return TileType.Horizontal;
  }

  if(next === Cardinal.North && last === Cardinal.South || last === Cardinal.North && next === Cardinal.South){
    return TileType.Vertical;
  }

  if(next === Cardinal.North && last === Cardinal.East || last === Cardinal.North && next === Cardinal.East){
    return TileType.CornerNorthEast;
  }

  if(next === Cardinal.North && last === Cardinal.West || last === Cardinal.North && next === Cardinal.West){
    return TileType.CornerNorthWest;
  }

  if(next === Cardinal.South && last === Cardinal.East || last === Cardinal.South && next === Cardinal.East){
    return TileType.CornerSouthEast;
  }

  if(next === Cardinal.South && last === Cardinal.West || last === Cardinal.South && next === Cardinal.West){
    return TileType.CornerSouthWest;
  }

  return TileType.Empty;
}

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