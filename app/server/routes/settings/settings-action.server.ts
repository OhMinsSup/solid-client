import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { parseWithZod } from "@conform-to/zod";
import { safeRedirect } from "remix-utils/safe-redirect";
import { PAGE_ENDPOINTS, RESULT_CODE } from "~/constants/constant";
import { validateMethods } from "~/server/utils/request.server";
import { schema } from "~/services/validate/user-update-api.validate";
import { ErrorType, ResponseError } from "~/services/error";

export const settingsAction = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  // 유효성 검사
  validateMethods(request, ["POST"], PAGE_ENDPOINTS.ROOT);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  // Report the submission to client if it is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }

  console.log(submission.value);

  try {
    return submission.reply({});
  } catch (e) {
    if (e instanceof Error && e.name === ErrorType.ResponseError) {
      const typesafeError = e as ResponseError;
      const data = typesafeError.getErrorData();
      const response = await data.response.json<FetchRespSchema.Error>();
      const isNotExistsUser = response.resultCode === RESULT_CODE.NOT_EXIST;
      if (isNotExistsUser) {
        throw redirect(
          safeRedirect(
            `${PAGE_ENDPOINTS.AUTH.SIGNUP}?email=${submission.value.email}`
          )
        );
      }

      return submission.reply({
        fieldErrors: {
          [response.error]: [response.message],
        },
      });
    }
    return submission.reply({
      formErrors: ["로그인에 실패했습니다. 다시 시도해주세요."],
    });
  }
};

export type RoutesActionData = typeof settingsAction;
