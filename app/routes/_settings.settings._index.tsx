import { SettingUserArea } from "~/components/setting/future/SettingUserArea";
import SettingUserFormProvider from "~/components/setting/context/form";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { settingsMeta } from "~/.server/routes/settings/settings-meta";
import { settingsAction } from "~/.server/routes/settings/settings-action.server";

export const meta = settingsMeta;

export const action = settingsAction;

export type RoutesActionData = typeof action;

export default function Routes() {
  return (
    <SettingUserFormProvider>
      <SettingUserArea />
    </SettingUserFormProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <Routes />;
  } else if (error instanceof Error) {
    return <Routes />;
  } else {
    return <Routes />;
  }
}
