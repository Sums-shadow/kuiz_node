const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Question = require('../models/Question');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const user = await User.create({
    username: 'testuser',
    password: 'testpassword'
  });
  token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Question API', () => {
  beforeEach(async () => {
    await Question.deleteMany({});
  });

  test('should create a new question', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        value: 'What is the capital of France?',
        responses: [
          { value: 'Paris', correct: true },
          { value: 'London', correct: false }
        ]
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.value).toBe('What is the capital of France?');
  });

  test('should get all questions', async () => {
    await Question.create({
      value: 'What is the capital of France?',
      responses: [
        { value: 'Paris', correct: true },
        { value: 'London', correct: false }
      ]
    });

    const res = await request(app).get('/api/questions');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
  });

  test('should update a question', async () => {
    const question = await Question.create({
      value: 'What is the capital of France?',
      responses: [
        { value: 'Paris', correct: true },
        { value: 'London', correct: false }
      ]
    });

    const res = await request(app)
      .put(`/api/questions/${question._id}`)
      .set('x-auth-token', token)
      .send({
        value: 'What is the capital of Spain?',
        responses: [
          { value: 'Madrid', correct: true },
          { value: 'Barcelona', correct: false }
        ]
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.value).toBe('What is the capital of Spain?');
  });

  test('should delete a question', async () => {
    const question = await Question.create({
      value: 'What is the capital of France?',
      responses: [
        { value: 'Paris', correct: true },
        { value: 'London', correct: false }
      ]
    });

    const res = await request(app)
      .delete(`/api/questions/${question._id}`)
      .set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Question removed');
  });
});