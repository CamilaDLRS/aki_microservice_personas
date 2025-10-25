import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface StudentAttributes {
  id: number;
  cpf: string;
  full_name: string;
  device_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

export class StudentModel extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes {
  public id!: number;
  public cpf!: string;
  public full_name!: string;
  public device_id!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
}

export function initStudentModel(sequelize: Sequelize) {
  StudentModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      device_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
      }
    },
    {
      sequelize,
      tableName: 'students',
      timestamps: false
    }
  );
}