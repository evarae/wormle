# Wormle TODO List

## Frontend

- [ ] Info Route
- [ ] Hints
- [ ] Testing
- [ ] Improve path letters

## Infrastructure

- [x] Website/domain set up
- [ ] Invalidate cloudfront cache when new puzzle is uploaded

## Backend

- [x] Database for games
- [x] Lambda that takes database entry and copies to s3
- [ ] GHA triggers the lambda to replace the puzzle
- [ ] Securely and conveniently add new games to the database

## Game maker program

- [x] Inputs for words, path, offset
- [x] BFS gives list of valid path options
- [x] Export game to JSON etc

## Other

- [ ] Playtest
