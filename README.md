# Mavennet Tech Challenge

Web backend challenge solution for Mavennet. Made using Node.js and express, with Mocha and Chai for testing.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Requirements

Have Node.js and npm installed. Download can be found here: https://nodejs.org/en/

### Installing

Start off by obtaining the node modules needed by running the following in the root:

```
npm install
```

For running the server and tests, install the Nodemon and Mocha+Chai:

```
npm install -g nodemon
npm install -g mocha
npm install chai
```

Once done, navigate to '/server/' and run the following to start the server:

```
nodemon app.js
```

The server should now be ready, and can take the following requests:

POST:
* /login - will use the mock user data defined in `app.js` to login and return a JWT bearer token for authorization
* /users - unauthenticated route that will return the data of all stored users
* /photos - authenticated route that will return all of the photos owned by the current user
* /albums - authenticated route that will return all of the albums owned by the current user

GET:
* /photos/:id - authenticated route that will return the requested photo, if owned by the current user
* /albums/:id - authenticated route that will return the requested album, if owned by the current user

## Running the tests

Once you have the server up and running, navigate to `/tests` and run the following:

```
mocha albums.tests.js
```

When complete, you should see the result of each test, along with the runtime.

The three tests are made to test the /albums/:id functionality, and three responses that are available from the endpoint.

## Modification/File structure

Navigating to `/server/data` will show you all of the JSON files used to store data, in the form of `users/photos/albums` as per the design spec.

If you with to authenticate with a different user, navigate to the `/login` definition in `app.js` and edit the mock user data.

Each user has a list of albums as a property, and can be edited to match any of the `id` properties of the albums in the `albums.json` file.

`users.json` is an example file, where user data can be taken from, but none of the users contain a `albums` property, and must be added before use.

All of the photos defined in `photos.json` map to their responding album using their `albumId` property.

## Built With

* [Node.js](https://github.com/nodejs/node) - JS Runtime Environment
* [Express](https://github.com/expressjs/express) - Web Framework
* [Mocha](https://github.com/mochajs/mocha) - JS Test Framework
* [Chai](https://github.com/chaijs/chai) - Test Assertion Framework

## Possible Improvements/Expansions
* Improve runtime of photo/album retrieval by storing albums/photos as a heap
* Link `users.json` to an actual database, to allow user creation and retreival opposed to creating a mock user
* Add addition functionality to allow for shared albums, or mass album/photo search using `/albums/:id1/:id2`, to return albums between id1 to id2
* Improve security and ease of access by using other authentication methods like OAuth, or storing data with cookies

