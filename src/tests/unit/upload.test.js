const { updateProductImage } = require('../../api/upload/services/upload.service');
const pool = require('../../config/database');

jest.mock('pg');

describe('Upload Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update product image', async () => {
    const mockResult = { id: 1, image_url: '/uploads/1234567890.jpg' };
    pool.query.mockResolvedValue({ rows: [mockResult] });

    const result = await updateProductImage(1, 1, '/uploads/1234567890.jpg');
    expect(result).toEqual(mockResult);
    expect(pool.query).toHaveBeenCalled();
  });
});