import { useCallback } from "react";
import styles from "./styles.module.css";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import { useWriteContext } from "~/components/write/context/useWriteContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

export default function WritePageHeader() {
  const { setSideOpen, isSideOpen, isMarkdownMode, setMarkdownMode } =
    useWriteContext();

  const onToggleSidebar = useCallback(() => {
    setSideOpen();
  }, [setSideOpen]);

  const onCheckedMarkdownChange = useCallback(
    (checked: boolean) => {
      setMarkdownMode(checked);
    },
    [setMarkdownMode]
  );

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          {isSideOpen ? null : (
            <Button
              type="button"
              size="sm"
              aria-label="Open left sidebar"
              variant="ghost"
              onClick={onToggleSidebar}
            >
              <Icons.openLeftSidebar />
            </Button>
          )}
        </div>
        <div className={styles.container_right}>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <Icons.chevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col space-y-3 h-auto w-full text-sm">
                  <Button
                    variant="ghost"
                    className="flex justify-start space-x-2"
                    size="sm"
                  >
                    <Icons.history className="size-5" />
                    <span>Revision History</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex justify-start space-x-2"
                    size="sm"
                  >
                    <Icons.settings2 className="size-5" />
                    <span>Draft Settings</span>
                  </Button>
                  <Separator
                    aria-orientation="vertical"
                    orientation="vertical"
                    className="min-h-full h-px w-full"
                    role="separator"
                  />
                  <div className="flex items-center justify-between space-x-2 px-3">
                    <div className="flex justify-center items-center space-x-2">
                      <Icons.moon className="size-5" />
                      <Label htmlFor="theme-mode" className="text-xs">
                        Dark mode
                      </Label>
                    </div>
                    <Switch id="theme-mode" />
                  </div>
                  <div className="flex items-center justify-between space-x-2 px-3">
                    <div className="flex justify-center items-center space-x-2">
                      <Icons.markdown className="size-5 stroke-current" />
                      <Label htmlFor="markdown-mode" className="text-xs">
                        Raw markdown editor
                      </Label>
                    </div>
                    <Switch
                      id="markdown-mode"
                      checked={isMarkdownMode}
                      onCheckedChange={onCheckedMarkdownChange}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator
            aria-orientation="vertical"
            orientation="vertical"
            className="mx-4 min-h-full h-px"
            role="separator"
          />
          <div className="flex flex-row space-x-2 md:space-x-3">
            <Button variant="outline">
              <span className="hidden md:flex">Preview</span>
              <Icons.fileSearch className="flex md:hidden" />
            </Button>
            <Button variant="default">Publish</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
