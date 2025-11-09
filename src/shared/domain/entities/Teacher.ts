import bcrypt from 'bcryptjs';

export interface TeacherProps {
  id?: number;
  cpf: string;
  full_name: string;
  email: string;
  password_hash?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export class Teacher {
  constructor(public props: TeacherProps) {}

  async validatePassword(password: string): Promise<boolean> {
    if (!this.props.password_hash) {
      return false;
    }
    return bcrypt.compare(password, this.props.password_hash);
  }
}
