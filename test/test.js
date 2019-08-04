const request = require('supertest');
const expect = require('expect');

const app = require('../app.js');

describe('jwt REST-API test', () => {
  it('health check', (done) => {
    request(app)
      .get('/api/healthcheck')
      // .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        success: true,
        message: "check ok!"
      })
      .end(done);
  })

  it('login failure', (done) => {
    request(app)
      .post('/api/login')
      .send({ id: "admin", password: "gass"})
      .expect(200)
      .expect({
        success: false,
        message: "invalid credentials"
      })
      .end(done);
  })

  var token = "";
  it('login success', (done) => {
    request(app)
      .post('/api/login')
      .send({ id: "admin", password: "pass" })
      .expect(200)
      .expect((res) => {
        token = res.body.token;
      })
      .end(done);
  })

  it('access without token', (done) => {
    request(app)
      .get('/api/verifytoken')
      .expect(401)
      .end(done);
  })

  it('api access', (done) => {
    request(app)
      .get('/api/verifytoken')
      .set('Authorization', 'Bearer ' + token)
      // .set('Accept', 'application/json')
      .expect(200)
      .end(done);
  })

})

