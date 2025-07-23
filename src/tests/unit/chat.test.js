const { saveMessage } = require('../../api/chat/services/chat.service');
const pool = require('../../config/database');

jest.mock('pg');

describe('Chat Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should save a message', async () => {
    const mockMessage = {
      id: 1,
      sender_id: 1,
      receiver_id: 2,
      content: 'Hello',
    };
    pool.query.mockResolvedValue({ rows: [mockMessage] });

    const result = await saveMessage({ senderId: 1, receiverId: 2, content: 'Hello' });
    expect(result).toEqual(mockMessage);
    expect(pool.query).toHaveBeenCalled();
  });
});