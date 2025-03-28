import { loggerManager } from './logger';

describe('Logger', () => {
  it('should be defined', async () => {
    const logger = new loggerManager({
      name: 'gateway',
      id: 'gateway_id',
    });
    await logger.info('测试info', '测试日志内容', {
      message: '测试日志内容',
    });
  });
});
