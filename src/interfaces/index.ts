export interface Credential {
  readonly email: string;
  readonly password: string;
}

export interface Schedule {
  readonly date: string;
  readonly business_day: boolean;
}
