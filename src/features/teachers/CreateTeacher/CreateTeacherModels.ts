export interface CreateTeacherInput {
  cpf: string;
  full_name: string;
  email: string;
  password_hash?: string | null;
}
