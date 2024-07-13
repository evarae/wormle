# WORMLE

Wormle is a daily word game created by Rae McLean. Players guide a worm through the grid to spell a related word on each line, using the arrow keys or mouse. Play wormle at [wormle.com](https://wormle.com).

This is a react app written in typescript, and was bootstrapped with [Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

## CI/CD Pipeline

On push to main, the github actions workflow "PushToMain.yml" will run. This will:

- Build using node version 22.x
- Run unit tests
- Use an IAM access key to log into a AWS user who has s3 write permissions, and upload the contents of the /build folder into an s3 bucket: https://wormle.s3.amazonaws.com/index.html.

## AWS Architecture

Wormle runs on AWS services.

- S3: contains the front-end build files
- Cloudfront: surfaces S3 files and post-statistic lambda function URL
- DynamoDB - daily game table: Stores daily puzzles as JSON files
- DynamoDB - statistic table: Stores statistics posted from the frontend, e.g. streak data
- Cloudwatch: triggers Lambda to update the game file every 24 hours
- Lambda - update game: take latest puzzle in DynamoDB and writes it to S3 file
- Lambda - post statistics: write statistics to DynamoDB table. Returns statistics (e.g. you did better than 4% of other players).
- Route 53: Domain registrar and DNS hosting. Points to cloudfront distribution.
- Amazon Certificate Manager: provides ssl certificate, uses DNS record hosted in route 53

## Defining the daily puzzle

The daily puzzle is defined in the public/data/game.json folder with the following structure:

`{
   "date":"2000-01-01",
   "game":{
      "words":[
         {
            "offset":0,
            "text":"ketchup"
         },
         {
            "offset":0,
            "text":"mustard"
         },
         {
            "offset":1,
            "text":"onion"
         },
         {
            "offset":1,
            "text":"pickle"
         }
      ],
      "pathString":"kcinipoumketstchupdraonle",
      "startCoordinates":{
         "x":4,
         "y":3
      },
      "theme":"The Works"
   }
}`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
