export interface Question {
  id?: number;
  question: string;
  month?: number | null;
  date?: string | null;
  keyword?: string | null;
  likes?: number;
  dislikes?: number;
}

export interface QuestionDTO {
  id: number;
  question: string;
  month?: number;
  date?: string;
  keyword?: string;
  likes?: number;
  dislikes?: number;
}

// QuestionModel.ts
export interface QuestionModel {
  id: number;
  question: string;
  month?: number;
  date?: Date;
  keyword?: string;
  likes?: number;
  dislikes?: number;
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  user_id: bigint;
  subscriptions?: string;
  date_joined?: Date;
  date_recent_response?: Date;
  responses_sum?: number;
}

// UserDTO.ts
export interface UserDTO {
  id: number;
  first_name: string;
  last_name: string;
  user_id: bigint;
  subscriptions?: string;
  date_joined?: string;
  date_recent_response?: string;
  responses_sum?: number;
}

// UserModel.ts
export interface UserModel {
  id?: number;
  first_name: string;
  last_name: string;
  user_id: number;
  subscriptions?: string;
  date_joined?: Date;
  date_recent_response?: Date;
  responses_sum?: number;
}

export interface Response {
  id?: number;
  user_id: number;
  date?: Date;
  question: string;
  response: string;
}

export interface ResponseDTO {
  id: number;
  user_id: bigint;
  date?: string;
  question: string;
  response: string;
}

// ResponseModel.ts
export interface ResponseModel {
  id: number;
  user_id: bigint;
  date?: Date;
  question: string;
  response: string;
}
