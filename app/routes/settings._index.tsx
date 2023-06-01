import { redirect } from "@remix-run/cloudflare";
import Json from "superjson";
import { PAGE_ENDPOINTS, RESULT_CODE, STATUS_CODE } from "~/constants/constant";
import Input from "~/components/setting/Input";
import Textarea from "~/components/setting/Textarea";
import AvailableCount from "~/components/setting/AvailableCount";
import InputIdentity from "~/components/setting/InputIdentity";
import InputTechStack from "~/components/setting/InputTechStack";
import InputProfileImage from "~/components/setting/InputProfileImage";

// api
import { userUpdateSchema } from "~/api/user/validation/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionErrorWrapper } from "~/api/validation/errorWrapper";

// hooks
import { useOptionalSession } from "~/api/user/hooks/useSession";
import { useForm, FormProvider } from "react-hook-form";
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";

// types
import type { SubmitHandler } from "react-hook-form";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/cloudflare";
import type { UserUpdateBody } from "~/api/user/validation/update";

export const meta: V2_MetaFunction = ({ matches }) => {
  const Seo = {
    title: "Change settings — Hashnode",
  };
  const rootMeta =
    // @ts-ignore
    matches.filter((match) => match.id === "root")?.at(0)?.meta ?? [];
  const rootMetas = rootMeta.filter(
    // @ts-ignore
    (meta) =>
      meta.name !== "description" &&
      meta.name !== "og:title" &&
      meta.name !== "og:description" &&
      meta.name !== "twitter:title" &&
      meta.name !== "twitter:description" &&
      !("title" in meta)
  );
  return [
    ...rootMetas,
    {
      title: Seo.title,
    },
    {
      name: "og:title",
      content: Seo.title,
    },
    {
      name: "twitter:title",
      content: Seo.title,
    },
  ];
};

export const action = async ({ context, request }: ActionArgs) => {
  return actionErrorWrapper(async () => {
    const { json } = await context.api.user.updateUser(request);
    if (json.resultCode !== RESULT_CODE.OK) {
      return redirect(PAGE_ENDPOINTS.SETTINGS.ROOT, {
        status: STATUS_CODE.BAD_REQUEST,
      });
    }
    return redirect(PAGE_ENDPOINTS.SETTINGS.ROOT);
  });
};

export type SettingAction = typeof action;

export type FormFieldValues = UserUpdateBody;

export default function Profile() {
  const fetcher = useFetcher();
  const session = useOptionalSession();

  const methods = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: session?.profile?.name ?? "",
      username: session?.username ?? "",
      email: session?.email ?? "",
      tagline: session?.profile?.tagline ?? undefined,
      avatarUrl: session?.profile?.avatarUrl ?? undefined,
      location: session?.profile?.location ?? undefined,
      bio: session?.profile?.bio ?? undefined,
      skills: session?.skills?.map((skill) => skill.name) ?? [],
      availableText: session?.profile?.availableText ?? undefined,
      socials: {
        github: session?.socials?.github ?? undefined,
        facebook: session?.socials?.facebook ?? undefined,
        twitter: session?.socials?.twitter ?? undefined,
        instagram: session?.socials?.instagram ?? undefined,
        website: session?.socials?.website ?? undefined,
      },
    },
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<FormFieldValues> = (input) => {
    fetcher.submit(
      {
        body: Json.stringify(input),
      },
      {
        method: "POST",
        action: "/settings?index",
        replace: true,
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form className="content" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-row flex-wrap">
          <div className="w-full lg:w-1/2 lg:pr-10">
            <h4 className="mb-5 text-xl font-bold text-slate-900">
              Basic Info
            </h4>
            <div className="mb-6">
              <Input
                type="text"
                text="Full name"
                id="nameField"
                name="name"
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-6">
              <Input
                type="text"
                text="Profile Tagline"
                id="tagline"
                name="tagline"
                placeholder="Software Developer @ …"
              />
            </div>
            <div className="mb-6">
              <InputProfileImage />
            </div>
            <div className="mb-6">
              <Input
                type="text"
                text="Location"
                id="location"
                name="location"
                placeholder="California, US"
              />
            </div>
            <h4 className="mb-5 mt-10 text-xl font-bold text-slate-900">
              About You
            </h4>
            <div className="mb-6">
              <Textarea
                id="moreAboutYou"
                name="bio"
                text="Profile Bio (About you)"
                placeholder="I am a developer from …"
              />
            </div>
            <div className="mb-6">
              <InputTechStack />
            </div>
            <div className="mb-6">
              <Textarea
                id="availableFor"
                text="Available for"
                name="availableText"
                placeholder="I am available for mentoring, …"
              />
              <AvailableCount />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h4 className="mb-5 text-xl font-bold text-slate-900">Social</h4>
            <div className="mb-6">
              <Input
                type="url"
                id="twitter"
                text="Twitter Profile"
                name="socials.twitter"
                placeholder="https://twitter.com/johndoe"
                pattern="(http|https)://twitter\.com\/(.+)|(http|https)://www\.twitter\.com\/(.+)"
              />
            </div>
            <div className="mb-6">
              <Input
                type="url"
                id="instagram"
                text="Instagram Profile"
                name="socials.instagram"
                placeholder="https://instagram.com/johndoe"
                pattern="(http|https)://instagram\.com\/(.+)|(http|https)://www\.instagram\.com\/(.+)"
              />
            </div>
            <div className="mb-6">
              <Input
                type="url"
                id="github"
                text="GitHub Profile"
                name="socials.github"
                placeholder="https://github.com/hashnode"
                pattern="(http|https)://github\.com\/(.+)|(http|https)://www\.github\.com\/(.+)"
              />
            </div>
            <div className="mb-6">
              <Input
                type="url"
                id="facebook"
                text="Facebook Profile"
                name="socials.facebook"
                placeholder="https://facebook.com/johndoe"
                pattern="(http|https)://facebook\.com\/(.+)|(http|https)://www\.facebook\.com\/(.+)|(http|https)://fb\.com\/(.+)|(http|https)://www\.fb\.com\/(.+)"
              />
            </div>
            <div className="mb-6">
              <Input
                type="url"
                id="website"
                text="Website URL"
                name="socials.website"
                placeholder="https://johndoe.com"
              />
            </div>
            <h4 className="mb-5 mt-10 text-xl font-bold text-slate-900">
              Profile Identity
            </h4>
            <div className="mb-6">
              <InputIdentity
                type="text"
                id="username"
                name="username"
                text="username"
                desc="You can change username once. This is the last chance."
              />
            </div>
            <div className="mb-6">
              <InputIdentity
                type="email"
                id="email"
                name="email"
                text="Email address"
                desc={`Changing your email address might break your OAuth sign-in if your
              social media accounts do not use the same email address. Please
              use magic link sign-in if you encounter such an issue.`}
              />
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4">
          <button className="btn-submit" type="submit">
            Update
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
