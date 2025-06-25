export interface Level {
  id: string;
  name: string; // np. 'beginner'
  label: string; // np. 'Beginner'
  order_index?: number;
}

export interface SupabaseLevel {
  name: string;
  label: string;
}
