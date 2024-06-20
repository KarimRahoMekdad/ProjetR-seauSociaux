const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

require('dotenv').config();

const MONGO_TEST = process.env.MONGO_JEST;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({});
}, 10000);

describe('Authentification', () => {
    describe('POST /api/register', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const email = 'test@example.com';
            const password = 'password';

            const response = await request(app)
                .post('/api/register')
                .send({ email, password })
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', email.toLowerCase());

            const user = await User.findOne({ email });
            expect(user).toBeTruthy();

            const passwordMatch = await bcrypt.compare(password, user.password);
            expect(passwordMatch).toBe(true);
        });
    });

    describe('POST /api/login', () => {
        it('devrait permettre à un utilisateur existant de se connecter', async () => {
            const email = 'test@example.com';
            const password = 'password';

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ email, password: hashedPassword });

            const response = await request(app)
                .post('/api/login')
                .send({ email, password })
                .expect(200);

            expect(response.body).toHaveProperty('token');
        });

        it('devrait refuser l\'accès avec un mauvais mot de passe', async () => {
            const email = 'test@example.com';
            const password = 'password';

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ email, password: hashedPassword });

            await request(app)
                .post('/api/login')
                .send({ email, password: 'wrongPassword' })
                .expect(401);
        });

        it('devrait refuser l\'accès avec un utilisateur non enregistré', async () => {
            await request(app)
                .post('/api/login')
                .send({ email: 'nonexistent@example.com', password: 'password' })
                .expect(404);
        });
    });
});
