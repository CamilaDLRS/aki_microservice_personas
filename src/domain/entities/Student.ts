export interface StudentProps {
  id?: number;
  cpf: string;
  full_name: string;
  device_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export class Student {
  constructor(public props: StudentProps) {}

  get id() { return this.props.id; }
  get cpf() { return this.props.cpf; }
  get fullName() { return this.props.full_name; }
  get deviceId() { return this.props.device_id || null; }
}
