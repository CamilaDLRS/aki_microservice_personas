import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface TeacherAttributes {
  id: number;
  cpf: string;
  full_name: string;
  email: string;
  password_hash?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface TeacherCreationAttributes extends Optional<TeacherAttributes, 'id'> {}

export class TeacherModel extends Model<TeacherAttributes, TeacherCreationAttributes> implements TeacherAttributes {
  public id!: number;
  public cpf!: string;
  public full_name!: string;
  public email!: string;
  public password_hash!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
}

export function initTeacherModel(sequelize: Sequelize) {
  TeacherModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true },
    full_name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('GETDATE()') },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('GETDATE()') }
  }, { sequelize, tableName: 'teachers', timestamps: false });
}
