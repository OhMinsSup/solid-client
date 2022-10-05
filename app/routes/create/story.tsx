import React from "react";
import { ClientOnly } from "remix-utils";
import {
  CoverImage,
  CoverImagePopover,
  SubTitle,
  Title,
  WriteTemplate,
} from "~/components/write";
import { Editor } from "~/components/ui/Editor";
import { WriterHeader } from "~/components/ui/Header";
import { useWriteStore } from "~/stores/useWriteStore";

// validation
import { schema } from "~/libs/validation/schema";
import { ValidationError } from "yup";

import editor from "~/styles/editor.css";
import editorToolbar from "~/styles/editor-toolbar.css";

import type { ActionFunction, LinksFunction } from "@remix-run/cloudflare";

import { useFetcher } from "@remix-run/react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { TypographyIcon } from "~/components/ui/Icon";
import { ActionButton } from "~/components/write/_components";

import type { FileSchema } from "~/api/schema/file";

interface FormFieldValues {
  title: string;
  subTitle?: string;
  thumbnail: Omit<FileSchema, "createdAt" | "updatedAt" | "deletedAt"> | null;
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: editor },
    {
      rel: "stylesheet",
      href: editorToolbar,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const form = {
    title: formData.get("title"),
    subTitle: formData.get("subTitle"),
  };

  console.log(form);

  try {
    const validForm = await schema.write().validate(form, {
      abortEarly: false,
    });
  } catch (error) {
    if (ValidationError.isError(error)) {
      const errors = error.inner.reduce((acc, { path, message }) => {
        if (!path) return acc;
        acc[path] = message;
        return acc;
      }, {} as Record<string, string>);

      const focusId = error.inner[0]?.path;
      return {
        focusId,
        errors,
      };
    }
  }
};

export default function CreateStory() {
  const methods = useForm<FormFieldValues>();

  const fetcher = useFetcher();

  const { openSubTitle, visible } = useWriteStore();

  const onSubmit: SubmitHandler<FormFieldValues> = (input) => {
    fetcher.submit(input as Record<string, any>, {
      method: "post",
    });
  };

  const watchThumbnail = methods.watch("thumbnail");

  return (
    <FormProvider {...methods}>
      <WriteTemplate header={<WriterHeader />}>
        <form
          method="post"
          className="create-post"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {/* Step1 */}
          <div className="relative mb-10 flex flex-row items-center">
            <CoverImagePopover />
            <ActionButton
              icon={<TypographyIcon className="mr-2 h-5 w-5 fill-current" />}
              text="Add Subtitle"
              aria-label="add post sub title"
              aria-haspopup={visible.subTitle ? "true" : "false"}
              onPress={openSubTitle}
            />
          </div>
          {/* Cover Image */}
          {watchThumbnail && <CoverImage src={watchThumbnail.url} />}
          {/* Step2 */}
          <Title />
          {/* SubTitle */}
          <SubTitle />
          {/* Step3 */}
          <div className="relative z-20">
            <ClientOnly fallback={<>Loading....</>}>
              {() => <Editor />}
            </ClientOnly>
          </div>
        </form>
      </WriteTemplate>
    </FormProvider>
  );
}
