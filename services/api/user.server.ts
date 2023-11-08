import Json from "superjson";
import { redirect } from "@remix-run/cloudflare";

import { PAGE_ENDPOINTS, RESULT_CODE } from "~/constants/constant";

import { deleteUserApi as $deleteUserApi } from "services/fetch/users/delete-api.server";
import { putUserApi as $putUserApi } from "services/fetch/users/put-api.server";
import { getUserApi as $getUserApi } from "services/fetch/users/get-api.server";
import { getOwnerPostDetailApi as $getOwnerPostDetailApi } from "services/fetch/users/get-owner-post-api.server";

import {
  schema as $updateSchema,
  type FormFieldValues as $UpdateFormFieldValues,
} from "services/validate/user-update-api.validate";
import { FetchService } from "services/fetch/fetch.client";
import { schema as $getSchema } from "services/validate/user-get-api.validate";

// types
import type { Env } from "../app/env.server";
import type { ServerService } from "services/app/server.server";
import type { Params } from "@remix-run/react";

export class UserApiService {
  constructor(
    private readonly $env: Env,
    private readonly $server: ServerService
  ) {}

  /**
   * @version 2023-08-17
   * @description 작성자만 볼 수 있는 포스트 상세 조회 API
   * @param {string | number} id
   * @param {Request} request
   */
  async getOwnerPostDetail(id: string | number, request: Request) {
    return $getOwnerPostDetailApi(id, {
      request,
    });
  }

  /**
   * @version 2023-08-17
   * @description 유저 상세 정보 API
   * @param {Params} params
   * @param {Request} request
   */
  async get(params: Params, request: Request) {
    const input = await $getSchema.parseAsync(params);
    return $getUserApi(input.username, {
      request,
    });
  }

  /**
   * @version 2023-08-17
   * @description 수정 API
   * @param {Request} request
   */
  async update(request: Request) {
    const formData = await this.$server.readFormData(request);
    const bodyString = formData.get("body")?.toString() ?? "{}";
    const body = Json.parse<$UpdateFormFieldValues>(bodyString);
    const input = await $updateSchema.parseAsync(body);
    return $putUserApi(input, {
      request,
    });
  }

  /**
   * @version 2023-08-17
   * @description 삭제 API
   * @param {Request} request
   */
  async delete(request: Request) {
    return $deleteUserApi({
      request,
    });
  }

  /**
   * @version 2023-08-17
   * @description 작성자만 볼 수 있는 포스트 상세 조회
   * @param {Request} request
   * @param {string | number} id
   */
  async getOwnerPostDetailByUser(
    request: Request,
    id?: string | number | null
  ) {
    try {
      if (!id || isNaN(Number(id))) {
        return new Response("Not Found", { status: 404 });
      }
      const response = await this.getOwnerPostDetail(id, request);
      const json =
        await FetchService.toJson<FetchRespSchema.PostDetailResp>(response);
      if (json.resultCode !== RESULT_CODE.OK) {
        return new Response("Not Found", { status: 404 });
      }
      return json.result;
    } catch (error) {
      return new Response("Not Found", { status: 404 });
    }
  }

  /**
   * @version 2023-08-17
   * @description 유저 상세
   * @param {Params} params
   * @param {Request} request
   */
  async usernameByUser(params: Params, request: Request) {
    try {
      const response = await this.get(params, request);
      const json =
        await FetchService.toJson<FetchRespSchema.UserResponse>(response);
      if (json.resultCode !== RESULT_CODE.OK) {
        return new Response("Not Found", { status: 404 });
      }
      return json.result;
    } catch (error) {
      return new Response("Not Found", { status: 404 });
    }
  }

  /**
   * @version 2023-08-17
   * @description 유저 탈퇴
   * @param {Request} request
   */
  async deleteByUser(request: Request) {
    this.$server.readValidateMethod(
      request,
      "DELETE",
      PAGE_ENDPOINTS.SETTINGS.ROOT
    );

    try {
      await this.delete(request);

      return redirect(PAGE_ENDPOINTS.ROOT, {
        headers: this.$server.getClearAuthHeaders(),
      });
    } catch (error) {
      const error_fetch = await this.$server.readFetchError(error);
      if (error_fetch) {
        return error_fetch;
      }

      return null;
    }
  }

  /**
   * @version 2023-08-17
   * @description 유저 수정
   * @param {Request} request
   */
  async updateByUser(request: Request) {
    try {
      await this.update(request);

      return redirect(PAGE_ENDPOINTS.SETTINGS.ROOT);
    } catch (error) {
      const error_validation = this.$server.readValidateError(error);
      if (error_validation) {
        return error_validation;
      }

      const error_fetch = await this.$server.readFetchError(error);
      if (error_fetch) {
        return error_fetch;
      }

      return null;
    }
  }
}
