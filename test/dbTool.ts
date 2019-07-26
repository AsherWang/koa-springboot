import sequelize from './db';
import Person from './model/person';

export function reset() {
  return sequelize
    .authenticate()
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
