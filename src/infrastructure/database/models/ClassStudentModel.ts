import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface ClassStudentAttributes {
  id: number;
  class_id: number;
  student_id: number;
}
interface ClassStudentCreationAttributes extends Optional<ClassStudentAttributes, 'id'> {}

export class ClassStudentModel extends Model<ClassStudentAttributes, ClassStudentCreationAttributes>
  implements ClassStudentAttributes {
  public id!: number;
  public class_id!: number;
  public student_id!: number;
}

export function initClassStudentModel(sequelize: Sequelize) {
  ClassStudentModel.init(
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
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'class_students',
      timestamps: false
    }
  );
}