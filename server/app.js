//Yash Malik
//Below is a backend server that uses node.js to deliver album/photo/user information
//JWT is used to authenticate users

const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./data/users.json')
const photos = require('./data/photos.json')
const albums = require('./data/albums.json')
const app = express();

//Default get function
app.get('/', function(req, res) {
  res.send('Please login or use any of the other functions')
});

//Get function that returns a specific photo owned by an authenticated user
app.get('/photos/:id', verifyToken, (req, res) => {

  var id = req.params.id;

  //Use JWT to verify that the given login auth token is valid
  jwt.verify(req.token, 'token', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      //Create a list that stores user owned album ids
      const obj = authData.user.albums
      const albumlist = obj.split(' ');

      var foundphoto = []

      //Runtime of the loop below is O(n^2) when albumlist is equal to albums.length
      //Bestcase is Ω(n), as albumlist is usually quite small, and is more optimized than searching through all the albums
      //The runtime is dominated by the photo count, and can be improved by
      // storing the photos in a graph, and using a heap to remove the items that have already
      // been visited
      //This outer loop is necessary because it only allows access to the albums that the user owns
      for (var i = 0; i < albumlist.length; i++) {

        var temp = albumlist[i];

        //Iterate through the photos, and add the photo with a matching id to the empty array
        for (var j = 0; j < photos.length; j++) {
          if((photos[j].albumId == temp) && (photos[j].id == id)){

            foundphoto.push(photos[j])

          }
        }
      }

      //Verify that the photo has been found and return the found photo data
      if (foundphoto === undefined || foundphoto.length == 0){
        res.sendStatus(404);
      } else {
        res.json({
          foundphoto
        });
      }
    }
  });
});

//Get function that returns a specific album owned by an authenticated user
app.get('/albums/:id', verifyToken, (req, res) => {

  var id = req.params.id;

  jwt.verify(req.token, 'token', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {

      const obj = authData.user.albums
      const albumlist = obj.split(' ');
      var foundalbum = []

      //Runtime is O(n), where n is the number of albums the user owns
      for (var i = 0; i < albumlist.length; i++) {

        var temp = albumlist[i];

          if(temp == id){
            foundalbum.push(albums[i])
          }
      }

      //Verify that the album has been found and return the found album data
      if (foundalbum === undefined || foundalbum.length == 0){
        res.sendStatus(404);
      } else {
        res.json({
          foundalbum
        });
      }
    }
  });
});

//Posts the users and their data
app.post('/users', (req, res) => {

  res.json({
    users
  });

});

//Posts the albums owned by an authenticated user
app.post('/albums', verifyToken, (req, res) => {
  jwt.verify(req.token, 'token', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {

      const obj = authData.user.albums
      const albumlist = obj.split(' ');
      var foundalbums = []

      //Runtime is O(1)
      for (var i = 0; i < albumlist.length; i++) {

        var temp = albumlist[i];

        foundalbums.push(albums[temp - 1])
      }

      res.json({
        foundalbums
      });
    }
  });
});

//Posts the photos owned by an authenticated user
app.post('/photos', verifyToken, (req, res) => {
  jwt.verify(req.token, 'token', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {

      const obj = authData.user.albums
      const albumlist = obj.split(' ');
      var foundphotos = []

      //Runtime is O(n^2), same explanation as that for /photos/:id
      for (var i = 0; i < albumlist.length; i++) {

        var temp = albumlist[i];

        for (var j = 0; j < photos.length; j++) {
          if(photos[j].albumId == temp){

            foundphotos.push(photos[j])

          }
        }
      }
      res.json({
        foundphotos
      });
    }
  });
});

//Login function for usrs
app.post('/login', (req, res) => {
  //Mock user is created here for login
  //Change the values below if you with to login as a different user
  const user = {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    albums: "1 2 3",
  }

  //Creates and returns the bearer token needed to login (expiration time is ideally ~30m)
  jwt.sign({ user }, 'token', { expiresIn: '10h' }, (err, token) => {
    res.json({
      token
    });
  });
});

//Middleware function used to verify requests with the given token
function verifyToken(req, res, next) {

  //Obtain the authorization header from the request
  const header = req.headers['authorization'];

  //If there is a given header value, isolate the token
  if (typeof header !== 'undefined') {

    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;

    next();

  } else {
    res.sendStatus(403);
  }
}

module.exports = app.listen(5000, () => console.log('Listening on port 5000'));
