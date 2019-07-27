import sequelize from './db';
import Person from './model/person';

const prepareDb = sequelize.authenticate();

export function resetTable() {
  return prepareDb
    .then(() => Person.truncate())
    .then(() => Person.bulkCreate([
      { id: 1, name: 'asher' },
      { id: 2, name: 'soul' },
      { id: 3, name: 'writer' },
      { id: 4, name: 'john' },
      { id: 5, name: 'asherly' },
      { id: 6, name: 'susan' },
      { id: 7, name: 'leo' },
    ]))
    .catch((err: any) => {
      console.error('Unable to connect to the database:', err);
    });
}

export function resetDb() {
  return prepareDb
    .then(() => sequelize.drop())
    .then(() => sequelize.query(`CREATE TABLE "persons" (
  "id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "desc" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
  );`));
}

export function reset() {
  return resetDb().then(() => resetTable());
}
