import type { FileSchema } from "./file";
import type { UserSchema } from "./user";

export interface AuthRespSchema {
  userId: number;
  accessToken: string;
}

export interface UserRespSchema extends UserSchema {}

export interface PostRespSchema {
  dataId: number;
}

export interface SignedUrlRespSchema {
  uploadUrl: string;
}

export interface UploadRespSchema
  extends Omit<FileSchema, "createdAt" | "updatedAt" | "deletedAt"> {}
