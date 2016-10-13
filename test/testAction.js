import chai from 'chai';
import request from 'supertest';
const assert = chai.assert;
let server = request('http://localhost:8080');
//let server = request('https://ppav-ffc6f.appspot.com');

describe('test user send message to web app server', () => {

  let data = {};
  let message = {
    sender: { id: '1084793478302481' },
    recipient: { id: '297590880623480' },
    timestamp: 1476001829886,
    message: {
      mid: 'mid.1475998902672:8d66fe8bc32003a719',
      seq: 2384,
      text: '%rio'
    }
  };
  data['entry'] = [ 
    { id: '297590880623480',
      time: 1476001829886,
      messaging: [message]
    } ];
  
  data['object'] = 'page';

  it('send fake data message', (done) => {
    server.post('/webhook')
      .send(data)
      .expect((res) => {
        //console.log(res);
      })
      .end(done);
  });

});
    
