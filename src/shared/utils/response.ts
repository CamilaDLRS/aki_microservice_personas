export interface Meta {
  page?: number;
  size?: number;
  total?: number | null;
}

export function ok(data: any, message = 'Operation successful', meta: Meta | null = null) {
  return { data, meta, message };
}
