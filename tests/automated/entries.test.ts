import mongoose from 'mongoose'
import supertest from 'supertest'
import index from '../../src/index'
import EntryModel from '../../src/models/entry/Entry'
// import User from '../../models/user/User'

const api = supertest(index)

const newEntry = {
  field1: 'Hello World',
  field2: 47
}

describe('Entries router.', () => {
  test('Entries router is running.', async () => {
    const res = await api
      .get('/api/entries/ping')
      .expect(200)
    
    expect(res.text).toContain('Hello World')
  }, 100000)
  /****************************************************************************
   * User is able to post new entries.
   * When authentication fails response is a 401, message_code: 4012.
   * A repeated entry when a field should be unique returns 400 validation.
   ***************************************************************************/
  describe('User can post new entries.', () => {
    test('User can post new entries.', async () => {
      await EntryModel.deleteMany({})
      await api
        .post('/api/entries')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(201)
    }, 10000)
    test('Posting without token authentication returns 401 documented error.', async () => {
      await EntryModel.deleteMany({})
      const wrongTokenEntry = await api
        .post('/api/entries')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(401)
      
      expect(wrongTokenEntry.body.message_code).toBe(4012)
      expect(wrongTokenEntry.body.message_text).toBe('Token is invalid or has expired')
    }, 10000)
    test('If user doesn\'t exist returns a documented response and don\'t save the entry', async () => {
      await EntryModel.deleteMany({})
      const userDoesnExist = await api
        .post('/api/entries')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRvbnlzYXBhOTBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkMHpydXJkWS5DeGdHNkxwOW0uSDJLdUNNQW95WWVxTnFvVmkxODU5VWJRYUpJTHFnL1Bod3kiLCJpYXQiOjE2NDc1MTUwODN9.U0KZVH8VA9ZCxXBcLuVrCbdDrWxhYp49RPAvVD-DRXc')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(401)

      expect(userDoesnExist.body.message_code).toBe(4012)
      expect(userDoesnExist.body.message_text).toBe('Token is invalid or has expired')
    }, 10000)
    test('When posting entry with repeated fields that should be unique returns 409 with validation error.', async () => {
      await api
        .post('/api/entries')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
        .send(newEntry)

      const userDoesnExist = await api
        .post('/api/entries')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
        .send(newEntry)
        .expect('Content-Type', /application\/json/)
        .expect(409)

      expect(userDoesnExist.body.message_code).toBe(4092)
      expect(userDoesnExist.body.message_text).toBe('Entry validation failed: field1: Error, expected `field1` to be unique. Value: `Hello World`')
    }, 10000)
  })
})

afterAll(() => {
  void mongoose.connection.close()
})
