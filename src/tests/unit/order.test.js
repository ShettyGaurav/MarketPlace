const { createOrder } = require('../../api/orders/services/order.service');
const pool = require('../../config/database');

jest.mock('pg');

describe('Order Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an order', async () => {
    const mockOrder = {
      id: 1,
      buyer_id: 1,
      product_id: 1,
      status: 'PENDING',
    };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Product exists
      .mockResolvedValueOnce({ rows: [mockOrder] }); // Order creation

    const result = await createOrder({ buyerId: 1, productId: 1 });
    expect(result).toEqual(mockOrder);
    expect(pool.query).toHaveBeenCalledTimes(2);
  });
});