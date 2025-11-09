import { Sequelize } from 'sequelize';
import { initStudentModel, StudentModel } from '../database/models/StudentModel';
import { initTeacherModel, TeacherModel } from '../database/models/TeacherModel';
import { initClassModel, ClassModel } from '../database/models/ClassModel';
import { initClassStudentModel, ClassStudentModel } from '../database/models/ClassStudentModel';
import { initClassTeacherModel, ClassTeacherModel } from '../database/models/ClassTeacherModel';
import { logger } from '../../logger';

let sequelize: Sequelize;

export const getSequelize = () => sequelize;

export async function initSequelize() {
  const dialect = (process.env.DB_DIALECT || 'mssql') as any;
  const encrypt = process.env.DB_ENCRYPT !== 'false';
  const trustCert = process.env.DB_TRUST_CERT === 'true';
  const logSql = process.env.DB_LOG_SQL === 'true';
  sequelize = new Sequelize(
    process.env.DB_NAME || 'personas_db',
    process.env.DB_USER || 'sa',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 1433,
      dialect,
      logging: logSql ? (msg) => logger.debug({ sql: msg }) : false,
      dialectOptions: {
        options: {
          encrypt,
          trustServerCertificate: trustCert,
        },
      },
      pool: {
        min: Number(process.env.DB_POOL_MIN) || 1,
        max: Number(process.env.DB_POOL_MAX) || 10,
        idle: Number(process.env.DB_POOL_IDLE) || 10000,
        acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
      },
    }
  );

  // Initialize models
  initStudentModel(sequelize);
  initTeacherModel(sequelize);
  initClassModel(sequelize);
  initClassStudentModel(sequelize);
  initClassTeacherModel(sequelize);

  ClassModel.belongsToMany(StudentModel, {
    through: ClassStudentModel,
    foreignKey: 'class_id',
    otherKey: 'student_id',
  });
  StudentModel.belongsToMany(ClassModel, {
    through: ClassStudentModel,
    foreignKey: 'student_id',
    otherKey: 'class_id',
  });
  ClassModel.belongsToMany(TeacherModel, {
    through: ClassTeacherModel,
    foreignKey: 'class_id',
    otherKey: 'teacher_id',
  });
  TeacherModel.belongsToMany(ClassModel, {
    through: ClassTeacherModel,
    foreignKey: 'teacher_id',
    otherKey: 'class_id',
  });

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await sequelize.authenticate();
      logger.info('Database connection established');
      break;
    } catch (e: any) {
      logger.warn({ attempt, error: e.message }, 'DB connection attempt failed');
      if (attempt === 3) {
        throw e;
      }
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  // NOTE: No automatic sync. Schema expected to be migrated externally.
  logger.info('Database connection ready (no sync performed)');
}

export { sequelize };
