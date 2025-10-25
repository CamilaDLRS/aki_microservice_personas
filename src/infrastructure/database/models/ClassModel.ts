import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface ClassAttributes {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}
interface ClassCreationAttributes extends Optional<ClassAttributes, 'id'> {}

export class ClassModel
  extends Model<ClassAttributes, ClassCreationAttributes>
  implements ClassAttributes
{
  public id!: number;
  public name!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

export function initClassModel(sequelize: Sequelize) {
  ClassModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
    },
    {
      sequelize,
      tableName: 'classes',
      timestamps: false,
    }
  );
}
