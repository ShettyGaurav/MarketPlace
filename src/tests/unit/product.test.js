const { createProduct } = require('../../api/products/services/product.service');
const pool = require('../../config/database.js');

jest.mock('pg');

describe('Product Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a product', async () => {
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      seller_id: 1,
      image_url: null,
    };
    pool.query.mockResolvedValue({ rows: [mockProduct] });

    const result = await createProduct({
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      sellerId: 1,
      imageUrl: null,
    });
    expect(result).toEqual(mockProduct);
    expect(pool.query).toHaveBeenCalled();
  });
});