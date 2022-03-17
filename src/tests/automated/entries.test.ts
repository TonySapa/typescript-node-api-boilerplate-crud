import mongoose from 'mongoose';
import supertest from 'supertest';
import index from '../../index';
// import User from '../../models/user/User';

const api = supertest(index);

const newEntry = {
  field1: 'Hello World',
  field2: 47
};

describe('Entries router.', () => {
  test('Entries router is running.', async () => {
    const res = await api
      .get('/api/entries/ping')
      .expect(200);
    
    expect(res.text).toContain('Hello World');
  }, 100000);
  /****************************************************************************
   * User is able to post new entries.
   * When token is wrong response is a 401, message_code: 4012.
   ***************************************************************************/
  describe('User can post new entries.', () => {
    test('User can post new entries.', async () => {
      await api
        .post('/api/entries')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(201);
    }, 10000);
    test('Posting without token authentication returns 401 documented error.', async () => {
      const wrongTokenEntry = await api
        .post('/api/entries')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(401);
      
      expect(wrongTokenEntry.body.message_code).toBe(4012);
    }, 10000);
  });
});

afterAll(() => {
  void mongoose.connection.close();
});
