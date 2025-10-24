import { DataTypes, Sequelize, Model } from 'sequelize';

export class ClassTeacherModel extends Model { public class_id!: number; public teacher_id!: number; }

export function initClassTeacherModel(sequelize: Sequelize) {
  ClassTeacherModel.init({
    class_id: { type: DataTypes.INTEGER, primaryKey: true },
    teacher_id: { type: DataTypes.INTEGER, primaryKey: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('GETDATE()') }
  }, { sequelize, tableName: 'class_teachers', timestamps: false });
}
