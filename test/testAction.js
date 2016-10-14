import chai from 'chai';
import request from 'supertest';
import config from '../config';
const assert = chai.assert;
let server = request('http://localhost:8080');
const data = config.TEST_MESSAGE;

describe('test user send message to web app server', () => {

  it('send fake data message', (done) => {
    server.post('/webhook')
      .send(data)
      .expect((res) => {
        //console.log(res);
      })
      .end(done);
  });

});
    
