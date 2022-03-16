import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../index';
import User from '../../models/User';

const api = supertest(app);

beforeEach(async () => {
  /* const existingUserItem = {
    '_id': {
        '$oid': '6214b8a6d8b0a64006164c41'
    },
    'email': 'tonisanchez.dev@gmail.com',
    'passwordHash': '$2b$10$5BKG6sOd2z60Bhh95g8ghO3dza4Tdxc9ukYff8NRHyvUGmyrdJw9S',
    'account_status': 'active',
    'account_status_token': '$2b$10$Ms2xKADryXPL3GZagtPfr.IziWkvZTrB2S34xQdmszk2ZrnxkrV7W',
    '__v': {
        '$numberInt': '0'
    }
  }; */

  await User.deleteMany({});
  /* const existingUser = new User(existingUserItem);
  await existingUser.save(); */
});

describe('Users router', () => {

  test('On signup user is stored on database with account status pending (unconfirmed) and hashed password.', async () => {
    const userToSignup = {
      email: 'tonysapa90@gmail.com',
      password: 'Password123',
      language: 'es-ES'
    };

    const res = await api
      .post('/api/users/signup')
      .send(userToSignup)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(res.body.message_text).toContain('Signup successfully done. A confirmation email has been sent to your email');
    expect(res.body.crud.after.account_status).toBe('unconfirmed');
  }, 100000);

  test('Trying to signup without specifying language fails', async () => {
    const userMissingLanguage = {
      email: 'tonisanchez.dev@gmail.com',
      password: 'Password123'
    };

    const res = await api
    .post('/api/users/signup')
    .send(userMissingLanguage)
    .expect(422)
    .expect('Content-Type', /application\/json/);
    
    expect(res.body.message_code).toBe(4223);
    expect(res.body.message_text).toBe('Language should be specified with its own field');
  }, 100000);

  /* test('Activated user account can log in', async () => {
    await api
      .post('/api/users/login')
      .send(userToLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }); */
});

afterAll(() => {
  void mongoose.connection.close();
});
