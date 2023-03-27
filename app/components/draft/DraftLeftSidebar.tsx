import React, { useCallback } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import classNames from "classnames";

// components
import MyDraftSidebar from "~/components/draft/MyDraftSidebar";
import { Icons } from "~/components/shared/Icons";

// context
import { DraftSidebarProvider } from "~/context/useDraftSidebarContext";

// utils
import { firstLetterToUpperCase } from "~/utils/util";
import { scheduleMicrotask } from "~/libs/browser-utils";

// hooks
import { useFormContext } from "react-hook-form";
import { useSaveDraftsMutation } from "~/api/drafts/hooks/useSaveDraftsMutation";
import { useNewDraftsMutation } from "~/api/drafts/hooks/useNewDraftsMutation";
import { Transition, useDraftContext } from "~/context/useDraftContext";

// types
import type { FormFieldValues } from "~/routes/__draft";

interface DraftLeftSidebarProps {}

const DraftLeftSidebar: React.FC<DraftLeftSidebarProps> = () => {
  const { session } = useLoaderData();

  const { watch } = useFormContext<FormFieldValues>();

  const { draftId, changeDraftId, changeTransition, visibility } =
    useDraftContext();

  const mutation_save = useSaveDraftsMutation({
    onSuccess: (data) => {
      const {
        result: { dataId },
      } = data.result;
      changeDraftId(dataId);
      changeTransition(Transition.DONE);
    },
    onSettled: () => {
      scheduleMicrotask(() => changeTransition(Transition.IDLE));
    },
  });

  const mutation_new = useNewDraftsMutation({
    onSuccess: (data) => {
      const {
        result: { dataId },
      } = data.result;
      changeDraftId(dataId);
      changeTransition(Transition.DONE);
    },
    onSettled: () => {
      scheduleMicrotask(() => changeTransition(Transition.IDLE));
    },
  });

  const onNewOrSaveDraftClick = useCallback(async () => {
    const input = watch();
    const body = {
      ...input,
      thumbnail: input.thumbnail ? input.thumbnail.url : undefined,
      ...(draftId && { draftId }),
    };

    if (!draftId) {
      return mutation_new.mutateAsync(body);
    }
    return mutation_save.mutateAsync(body);
  }, [draftId, mutation_new, mutation_save, watch]);

  return (
    <DraftSidebarProvider>
      <div
        className={classNames("draft-sidebar", {
          "!hidden": !visibility.isLeftSidebarVisible,
        })}
        id="draft-sidebar"
        aria-hidden={!visibility.isLeftSidebarVisible}
      >
        <div className="draft-sidebar-header">
          <div className="sidebar-header__btn-back">
            <Link to="/" className="btn-back__icon">
              <Icons.ArrowLeft className="icon__sm flex-shrink-0 stroke-current" />
            </Link>
          </div>
          <div className="sidebar-header__title">
            <div className="sidebar-header__title-container">
              <div className="sidebar-header__title-icon">
                <div className="relative h-8 w-full">
                  <img src="/images/logo.png" alt="logo" className="ico__sm" />
                </div>
              </div>
              <div className="sidebar-header__title-text">
                <span className="text-ellipsis">
                  {firstLetterToUpperCase(session?.username)} Blog
                </span>
              </div>
            </div>
          </div>
        </div>
        <React.Suspense fallback={<>🌀 Loading...</>}>
          <MyDraftSidebar />
        </React.Suspense>
        <div className="draft-sidebar-footer">
          <button
            className="btn-new-draft"
            aria-label="new draft button"
            onClick={onNewOrSaveDraftClick}
            disabled={mutation_save.isLoading || mutation_new.isLoading}
          >
            <Icons.AddFile className="icon__base mr-2 stroke-current" />
            <span>New draft</span>
          </button>
        </div>
      </div>
    </DraftSidebarProvider>
  );
};

export default DraftLeftSidebar;
