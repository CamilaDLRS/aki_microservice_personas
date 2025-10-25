import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface ClassTeacherAttributes {
  id: number;
  class_id: number;
  teacher_id: number;
}
interface ClassTeacherCreationAttributes extends Optional<ClassTeacherAttributes, 'id'> {}

export class ClassTeacherModel extends Model<ClassTeacherAttributes, ClassTeacherCreationAttributes>
  implements ClassTeacherAttributes {
  public id!: number;
  public class_id!: number;
  public teacher_id!: number;
}

export function initClassTeacherModel(sequelize: Sequelize) {
  ClassTeacherModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'class_teachers',
      timestamps: false
    }
  );
}