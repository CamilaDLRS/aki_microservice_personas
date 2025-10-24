import { DataTypes, Sequelize, Model } from 'sequelize';

export class ClassStudentModel extends Model { public class_id!: number; public student_id!: number; }

export function initClassStudentModel(sequelize: Sequelize) {
  ClassStudentModel.init({
    class_id: { type: DataTypes.INTEGER, primaryKey: true },
    student_id: { type: DataTypes.INTEGER, primaryKey: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('GETDATE()') }
  }, { sequelize, tableName: 'class_students', timestamps: false });
}
