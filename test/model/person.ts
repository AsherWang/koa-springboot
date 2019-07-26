import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

class Person extends Model {
  public id!: number;
  public name!: string;
  public desc!: string | null; // for nullable fields
}

Person.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  desc: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'persons',
});

export default Person;
