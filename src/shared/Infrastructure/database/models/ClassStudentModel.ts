import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface ClassStudentAttributes {
  class_id: number;
  student_id: number;
  created_at?: Date;
}
type ClassStudentCreationAttributes = ClassStudentAttributes;

export class ClassStudentModel
  extends Model<ClassStudentAttributes, ClassStudentCreationAttributes>
  implements ClassStudentAttributes
{
  public class_id!: number;
  public student_id!: number;
  public created_at?: Date;
}

export function initClassStudentModel(sequelize: Sequelize) {
  ClassStudentModel.init(
    {
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'class_students',
      timestamps: false,
    }
  );
}
