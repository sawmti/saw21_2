import supertest from 'supertest';
import app from './app';

let server;

describe('/', () => {
  beforeAll(async (done) => {
    server = app.listen(null, () => {
      global.agent = supertest.agent(server);
      done();
    });
  });

  it('GET should return 200', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await server.close();
  });
});
