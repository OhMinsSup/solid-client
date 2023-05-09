// api
import { ApiService } from "../client.next";

// constants
import { API_ENDPOINTS } from "~/constants/constant";

// types
import type { BaseApiOptions } from "../client.next";

/**
 * @description 유저 삭제 API
 * @param {BaseApiOptions?} options
 */
export async function logoutApi(options?: BaseApiOptions) {
  const __nextOpts = ApiService.middlewareForAuth(ApiService.middlewareSetAuthticated(options));
  const { json, response } = await ApiService.postJson(
    API_ENDPOINTS.USERS.LOGOUT,
    undefined,
    __nextOpts?.init
  );
  console.log("response", response);
  const header = response.headers;
  return { json, header };
}
