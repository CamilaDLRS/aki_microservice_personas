import { DataTypes, Sequelize, Model, Optional } from 'sequelize';


interface ClassTeacherAttributes {
  class_id: number;
  teacher_id: number;
  created_at?: Date;
}
type ClassTeacherCreationAttributes = ClassTeacherAttributes;

export class ClassTeacherModel extends Model<ClassTeacherAttributes, ClassTeacherCreationAttributes> implements ClassTeacherAttributes {
  public class_id!: number;
  public teacher_id!: number;
  public created_at?: Date;
}

export function initClassTeacherModel(sequelize: Sequelize) {
  ClassTeacherModel.init(
    {
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      teacher_id: {
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
      tableName: 'class_teachers',
      timestamps: false,
    }
  );
}
