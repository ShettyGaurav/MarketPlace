const { register } = require('../../api/auth/services/auth.service');
const pool = require('../../config/database.js');
const bcrypt = require('bcrypt');

jest.mock('pg');
jest.mock('bcrypt');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a user', async () => {
    const mockUser = { id: 1, email: 'test@example.com', role: 'USER' };
    pool.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.hash.mockResolvedValue('hashedPassword');

    const result = await register({ email: 'test@example.com', password: 'password', name: 'Test' });
    expect(result).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalled();
  });
});