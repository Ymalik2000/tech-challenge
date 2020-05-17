//Yash Malik
//This file consists of unit tests for the /albums/:id call

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const server = require('../server/app.js');

chai.use(chaiHttp);

let token;

//Log in using the mock user defined in the server, and save the given token
before(async () => {
    const result = await chai
      .request(server)
      .post('/login')
    expect(result.status).to.equal(200);
    token = 'Bearer ' + result.body.token;
  });

  //Tests to see if the right album is return, if specified with /albums/:id
  //Mock user data being verified below is for:
  // const user = {
  //   id: 1,
  //   name: "Leanne Graham",
  //   username: "Bret",
  //   email: "Sincere@april.biz",
  //   albums: "1 2 3",
  // }

  //Throws an error if the user is not logged in
  describe('Unauthenticated request check', () => {
    it('should return status 403', async () => {
      try {
        const result = await chai
          .request(server)
          .get('/albums/1');
          
        expect(result.status).to.equal(403);
        
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  //Passes if the album data is returned correctly
  describe('Found requested album', () => {
    it('should return status 200', async () => {
      try {
        const result = await chai
          .request(server)
          .get('/albums/1')
          .set('Authorization', token);
          
        expect(result.status).to.equal(200);
        expect(result.body).to.deep.equal({
          "foundalbum": [
              {
                  "id": 1,
                  "title": "quidem molestiae enim"
              }
          ]
      });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

    //Tries to access an album the authenticated user does not own
    describe('Request unowned album', () => {
      it('should return status 404', async () => {
        try {
          const result = await chai
            .request(server)
            .get('/albums/999')
            .set('Authorization', token);
            
          expect(result.status).to.equal(404);
        } catch (error) {
          throw new Error(error);
        }
      });
    });