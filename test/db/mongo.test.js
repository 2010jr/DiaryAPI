const { Db } = require('../../db/mongo');

describe('Mongo DB Connect', () => {
  test('When URL is wrong, catch callback is invoked', () => {
    const wrongUrl = 'XXXX';
    expect.assertions(2);
    return Db.createDbPromise(wrongUrl).catch((e) => {
      expect(e.message).toBeDefined();
      expect(e.stack).toBeDefined();
    });
  });
});
