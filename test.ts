import request from 'supertest';
import App from './demo/app';

let server: any, agent: any;

beforeEach((done) => {
  const app = new App();
  server = server || app.start(4000);
  agent = request.agent(server, {});
  done();
});

afterEach((done) => {
  return server && server.close(done);
});


it('test api 2', async () => {
  expect.assertions(1);
  await agent.get('/home/api/v2')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, { code: 200, data: 'api2' });
  expect(1).toEqual(1);
});

