const { Db } = require('../../db/mongo');

const correctUrl = 'mongodb://bluemix:ibmbluemix@ds119486.mlab.com:19486/goal-diary-test';

describe('Mongo DB Connect', () => {
  test('When URL is wrong, catch callback is invoked', async () => {
    const wrongUrl = 'XXXX';
    expect.assertions(2);
    try {
      await Db.createDbPromise(wrongUrl);
    } catch (e) {
      expect(e.message).toBeDefined();
      expect(e.stack).toBeDefined();
    }
  });

  test('When URL is correct, no catch callback is invoked', async () => {
    expect.assertions(1);
    const db = await Db.createDbPromise(correctUrl);
    expect(db).toBeDefined();
  });
});

describe('Mongo DB Read', () => {
  let db;
  beforeAll(() => {
    db = new Db(Db.createDbPromise(correctUrl));
  });

  test('When collectionName is undefined, then return promise is rejected', async () => {
    expect.assertions(2);
    try {
      return await db.find(undefined, {});
    } catch (e) {
      expect(e.message).toBeDefined();
      expect(e.stack).toBeDefined();
    }
  });

  test('When collectionName does not exist, then return promise is fulfilled and no data', async () => {
    expect.assertions(1);
    const data = await db.find('XXXXX');

    expect(data.length).toBe(0);
  });
});
