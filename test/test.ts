import * as request from 'supertest';
import App from './app';
import { reset } from './dbTool';

let server: any, agent: any;

beforeAll((done) => {
  const app = new App();
  server = server || app.start(4000, true);
  agent = request.agent(server, {});
  reset().then(() => done());
});

afterAll((done) => {
  server.close(() => done());
});

test('test GET /persons', async () => {
  await agent.get('/persons')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function (response: any) {
      expect(response.body.length).toEqual(7);
    });
});

test('test GET /persons/1', async () => {
  await agent.get('/persons/1')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function(response: any) {
      expect(response.body.id).toEqual(1);
    });
});

test('test POST /persons', async () => {
  const newName = 'new guy';
  await agent.post('/persons')
    .send(`name=${newName}`)
    .set('Accept', 'application/json')
    .expect(201)
    .expect('Content-Type', /json/)
    .then(function(response: any) {
      expect(response.body.name).toBe(newName);
    });
});

test('test PUT /persons/1', async () => {
  const newName = 'new guy';
  await agent.put('/persons/1')
    .send(`name=${newName}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function(response: any) {
      expect(response.body.name).toBe(newName);
    });
});

test('test DESTROY /persons/1', async () => {
  const newName = 'new guy';
  await agent.delete('/persons/1')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function(response: any) {
      expect(response.body.id).toBe(1);
    });
});
