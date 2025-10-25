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
  constructor(public props: TeacherProps) {
  }
}
