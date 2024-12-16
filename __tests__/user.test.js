const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should login an existing user', async () => {
    await User.create({
      username: 'existinguser',
      password: 'existingpassword',
        name: 'existingname',
        role: 'user'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'existinguser',
        password: 'existingpassword'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});