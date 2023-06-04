import React, { useCallback, useState } from "react";
import classNames from "classnames";

// components
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Icons } from "~/components/shared/Icons";

// hooks
import { useDraftContext } from "~/context/useDraftContext";
import { useFormContext } from "react-hook-form";

// types
import type { FormFieldValues } from "~/routes/draft";

interface MyDraftItemProps {
  item: Partial<any>;
}

export default function MyDraftItem({ item }: MyDraftItemProps) {
  const { changeDraftId, draftId, $editorJS, toggleSubTitle } =
    useDraftContext();
  const [open, setOpen] = useState(false);
  const methods = useFormContext<FormFieldValues>();

  const onSelectedDraft = useCallback(async () => {
    // if (!item.id) return;
    // const draft = await hashnodeDB.getDraft(item.id);
    // if (!draft) return;
    // changeDraftId(item.id);
    // if (draft.subTitle) {
    //   toggleSubTitle(true);
    // }
    // methods.reset(draft);
    // if (draft.content && isString(draft.content)) {
    //   const data = JSON.parse(draft.content);
    //   if (!data) return;
    //   $editorJS?.render(data);
    // }
  }, [item.id, changeDraftId, methods, toggleSubTitle, $editorJS]);

  const onClickDelete = useCallback(async () => {
    // if (!item.id) return;
    // changeDraftId(undefined);
    // if (item.subTitle) {
    //   toggleSubTitle(false);
    // }
    // await hashnodeDB.deleteDraft(item.id);
  }, [changeDraftId, item.id, item.subTitle, toggleSubTitle]);

  return (
    <div
      aria-selected={
        draftId ? (draftId === item.id ? "true" : "false") : "false"
      }
      aria-label="my draft item"
      className={classNames("my-draft-item", {
        active: draftId ? draftId === item.id : false,
      })}
    >
      <button
        className={classNames("my-draft-content w-full", {
          active: draftId ? draftId === item.id : false,
        })}
        aria-label="my draft item"
        onClick={onSelectedDraft}
      >
        <div className="icon-wrapper">
          <Icons.EmptyFile className="icon__sm mr-2 flex-shrink-0 stroke-current" />
        </div>
        <div className="text">{item.title || "Untitled"}</div>
      </button>
      <div className="my-draft-more">
        <div className="my-draft-more--container">
          <DropdownMenu.Root
            open={open}
            onOpenChange={(open) => {
              setOpen(open);

              if (open) {
                changeDraftId(item.id);
              } else {
                changeDraftId(undefined);
              }
            }}
          >
            <DropdownMenu.Trigger asChild>
              <button className="btn-more" aria-label="Customise options">
                <Icons.EllipsisVertical className="icon__sm stroke-current" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="dropdown-menu-content--my-draft"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  role="button"
                  aria-label="my draft item delete"
                  className="dropdown-menu-item--my-draft"
                  onClick={onClickDelete}
                >
                  <Icons.Trash className="icon__sm mr-2 stroke-current" />
                  <span>Delete</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}
