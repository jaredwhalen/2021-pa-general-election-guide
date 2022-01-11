## TODO

This repo is a bit of a mess and is in need of refactoring. The plan was to completely redo the app in Svelte, but the author and maintainer left Gannett before that occured.

## Interacting with the Google API

This app uses [Gootenberg](https://github.com/The-Politico/gootenberg) to load data from various Google Docs and Sheets. [Read the docs](https://github.com/The-Politico/gootenberg/blob/main/docs/GoogleServiceAccount.md) to setup your `credentials.json` and `token.json` files.

## Preparing homepage and text data

There is file titled `archie.json` that contains data for the homepage and other text blocks in the app. While the JSON can be edited directly since this data will most likely not change, you can also use the built in `gulp archie` script to pull in the data from an Archie ML doc. An example of the Archie ML [can be found here](https://docs.google.com/document/d/1oXOjuDU-zdpK_hlbzup8IpchP6q0wgjUVsh5HbSl-_0/edit?usp=sharing).

| Field Name                  | Data Type     | Descritpion                                         |
| --------------------------- | ------------- | --------------------------------------------------- |
| state                       | Text          | State name for guide                                |
| backgroundImage             | URL           | URL of homepage background image                    |
| intro                       | Text          | Homepage introductory text.                         |
| dataPolicy                  | Text          | USA Today user data policy.                         |
| candidateResponseDisclaimer | Text          | Disclaimer that this data comes from the candidates |
| credits                     | Object / Text | Project credits                                     |

## Preparing candidate data

`gsheet.json` is the main data file in the application. Each row represents a single candidate in a single race. There is built in gulp task (`gulp gsheet`) for importing a Google Sheet as a JSON and saving it to `./src/data/gsheet.json`. An example of the Google Sheet [can be found here](https://docs.google.com/spreadsheets/d/1lbsiUYDggZUFHe3zAuZDJMBnR1ZhGqhcrc8oalFrdtY/edit?usp=sharing).

| Field Name    | Data Type | Example                             | Required |
| ------------- | --------- | ----------------------------------- | -------- |
| candidateCode | Text      | cid-de-0001; governor_carney_john   | yes      |
| districtCode  | Text      | statewide; state_senator_district_1 | yes      |
| office        | Text      | Governor, U.S. Senator              | yes      |
| level         | Text      | federal; state                      | yes      |
| party         | Text      | Democratic                          | yes      |
| displayName   | Text      | John C Carney Jr.                   | yes      |
| lastName      | Text      | Carney                              | no       |
| incumbent     | Boolean   | 1                                   | yes      |
| image         | File name | john_carney.jpg                     | no       |

## Preparing questionnaire data

The application is built to accept questionnaire data for various races, thus different question sets. For simplicity, the project data file is a single JSON file named `questionnaire.json`. Every response is its own object using the below key:value format.

| key           | value  |
|---------------|--------|
| `candidateCode` | *officeCode_candidateName* |
| `question`      | *String* |
| `response`      | *String* |

There is built in gulp task (`gulp gforms`) for importing multiple Google Form response Sheets and transposing the data into the above structure.

1. Place all the Google Sheets holding Google Form responses into a single Google Drive folder.
2. Your Google Forms will most likely collect values that should not be included in the questionnaire portion of the guide. Change `columnLimitIndex` in `gulpfile.js` to the last column index to include. In the same script,  the`bioResponse `object can be modified to use Google Form data in the bio section of a candidate.
3. Given the folder's Google ID, the function will iterate over the sheets and transpose the questions and responses into a single JSON file with the project path of `./src/data/questionnaire.json`, as well as the bio data to  `./src/data/bioResponses.json`

Both here and within the application, the `candidateCode` value is created using the `officeCode` and `Candidate` to form an ID, i.e., `pa_governor_jane_smith`. Assure that the input column names correspond with property names in the gulpfile. Also make sure that the values themselves correspond with the candidate and office names in the main data file.

## Preparing GIS data
The application uses topoJSON to determine what races to show a user on their ballot. The application takes a single topoJSON file that contains the different levels of geography.

1. First, identify the various levels of geography needed, i.e., a countywide race will need a county shapefile.
2. Using a program like QGIS, add a `districtCode` field that contains a **race** level identifier to filter against the dataset so that all the candidates for races in that district are returned. For example, *new_castle_county* corresponds with all the county level races in New Castle.
3. Most spatial data will have extraneous columns. In order to reduce the file footprint, it is recommended that you delete all fields except for the geography and the `districtCode`.
4. Next, make sure each layer is projected to the *EPSG:4326 coordinate reference system*.
4. Once your spatial data is standardized, it must be compiled into a single topoJSON file. The easiest way to do this is to use [mapshaper](https://mapshaper.org/). Simply upload all your files at once and export as topoJSON called `topo.json`.
5. Move `topo.json` to `./src/data` and make sure that the file name matches the import path in `./src/js/util/getDistrictsFromPoint.js`.




***

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `gulp archie`

Reads a Google Doc at the target Google ID, imports the markup language as JSON, and saves to `./src/data/archie.json`.

### `gulp gforms`

Reads a Google Sheet at the target Google ID, imports as  JSON, and saves to `./src/data/gsheet.json`.

gulp gforms

Reads a Google Drive Folder at the target Google ID, iterates over the nested Google Sheets, imports as  JSON, processes the data, and saves the questionnaire data to `./src/data/questionnaire.json` and the bio data to  `./src/data/bioResponses.json`.

