export interface ClassProps {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export class ClassEntity {
  constructor(public props: ClassProps) {
  }
}
