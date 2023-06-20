import React, { Suspense, useCallback, useState } from "react";
import { Logo } from "~/components/shared/future/Logo";
import styles from "./styles.module.css";
import { MainHeaderNavigation } from "~/components/shared/future/MainHeaderNavigation";

const MainDrawerMenu = React.lazy(() =>
  import("~/components/shared/future/MainDrawerMenu").then((mod) => ({
    default: mod.MainDrawerMenu,
  }))
);

export default function MainHeader() {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <header className={styles.root}>
      <section aria-hidden="false" className="css-0"></section>
      <Suspense>
        <MainDrawerMenu open={open} onClose={onClose} />
      </Suspense>
      <div className={styles.header}>
        <div className={styles.header__layout}>
          <div className={styles.header__layout__logo}>
            <Logo onOpen={onOpen} />
          </div>
          <div className={styles.header__layout__navigation}>
            <MainHeaderNavigation />
          </div>
          <div className={styles.header__layout__menu}>123</div>
        </div>
      </div>
    </header>
  );
}
