import * as request from 'supertest';
import App from './app';

let server: any, agent: any;

beforeAll((done) => {
  const app = new App();
  server = server || app.start(4000, true);
  agent = request.agent(server, {});
  done();
});

afterAll((done) => {
  return server && server.close(done);
});

const dataSource = [
  {id: 1, name: 'asher'},
  {id: 2, name: 'soul'},
  {id: 3, name: 'writer'},
  {id: 4, name: 'john'},
  {id: 5, name: 'asherly'},
  {id: 6, name: 'susan'},
  {id: 7, name: 'leo'},
];


test('test GET /persons', async () => {
  await agent.get('/persons')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function(response: any) {
      expect(response.body).toMatchObject(dataSource);
    });
});

test('test GET /persons/1', async () => {
  await agent.get('/persons/1')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function(response: any) {
      const targetData = dataSource.find(item => item.id === 1);
      expect(response.body).toMatchObject(targetData);
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

test('test PATCH /persons/1', async () => {
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
