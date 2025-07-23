const { getTotalSales } = require('../../api/analytics/services/analytics.service');
const pool = require('../../config/database');

jest.mock('pg');

describe('Analytics Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch total sales', async () => {
    const mockResult = { total_sales: '1000.00' };
    pool.query.mockResolvedValue({ rows: [mockResult] });

    const result = await getTotalSales();
    expect(result).toEqual({ totalSales: 1000 });
    expect(pool.query).toHaveBeenCalled();
  });
});