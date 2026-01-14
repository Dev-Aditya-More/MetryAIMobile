// api/apiResponse.ts
export class ApiError extends Error {
  code: string;
  data: any;
  success: boolean;

  constructor(
    message: string = "Something went wrong",
    code: string = "UNKNOWN",
    data: any = null
  ) {
    super(message);
    this.code = code;
    this.data = data;
    this.success = false;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const SUCCESS_CODE = "0";

export interface ApiEnvelope<T = any> {
  code: string;
  msg: string;
  data: T;
}

export function handleApiResponse<T>(body: ApiEnvelope<T>): T {
  if (!body || typeof body !== "object") {
    throw new ApiError("Invalid server response", "INVALID_RESPONSE");
  }

  if (body.code !== SUCCESS_CODE) {
    throw new ApiError(body.msg || "Something went wrong", body.code, body.data);
  }

  return body.data;
}
