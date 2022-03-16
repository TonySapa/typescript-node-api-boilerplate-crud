export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export interface UserToSignup {
  email: string;
  passwordHash: string;
  account_status?: string;
  account_status_token?: string;
}

export interface ApiResponseCrud {
  message_code: number,
  message_text: string,
  dev_tip?: string,
  crud: ApiResponseCrudResult
}

export type ApiResponse = Omit<ApiResponseCrud, 'crud'>;

export interface ApiResponseCrudResult {
  before: unknown,
  after: unknown
}

export enum Language {
  'en-US',
  'es-ES'
}