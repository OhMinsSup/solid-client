import React, { useRef } from "react";
import styles from "./styles.module.css";
import { Link, NavLink, useLocation } from "@remix-run/react";
import { NAVIGATION_ITEMS, PAGE_ENDPOINTS } from "~/constants/constant";
import { Logo } from "~/components/shared/future/Logo";
import styles_logo from "~/components/shared/future/Logo/styles.module.css";
import classNames from "classnames";
import { useOutsideClick } from "~/libs/hooks/useOutsideClick";

interface MainDrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MainDrawerMenu({ open, onClose }: MainDrawerMenuProps) {
  const $ele = useRef<HTMLDivElement | null>(null);

  useOutsideClick({
    enabled: open,
    ref: $ele,
    handler: (ele) => {
      onClose();
    },
  });

  return (
    <div
      ref={$ele}
      className={classNames(styles.root, {
        [styles.open]: open,
      })}
    >
      <div className={styles.logo_container}>
        <Link
          className={styles_logo.logo}
          to={PAGE_ENDPOINTS.ROOT}
          aria-label="Hashnode Logo"
        >
          <Logo.White className={styles_logo.logo_dark} />
          <Logo.Dark className={styles_logo.logo_white} />
        </Link>
      </div>
      <div className={styles.navigation}>
        <div className={styles.navigation_items}>
          {NAVIGATION_ITEMS.filter((item) =>
            item.position.includes("left")
          ).map((item) => {
            return (
              <MainDrawerMenu.Item
                key={item.id}
                to={item.href}
                icon={<item.icon className={styles.navigation_items__icon} />}
                text={item.title}
                end={item.id !== 1}
              />
            );
          })}
        </div>
        <div className={styles.navigation_footer}>
          <MainDrawerMenu.Footer />
        </div>
      </div>
    </div>
  );
}

interface MainDrawerMenuItemProps {
  to: string;
  text: string;
  applyActiveLinks?: string[];
  end?: boolean;
  icon?: React.ReactNode;
}

MainDrawerMenu.Item = function MainDrawerMenuItem(
  props: MainDrawerMenuItemProps
) {
  const { to, text, icon, applyActiveLinks, ...resetProps } = props;

  const location = useLocation();

  return (
    <NavLink
      aria-label={text}
      to={to}
      className={({ isActive }) => {
        return classNames({
          [styles.active]:
            isActive || applyActiveLinks?.includes(location.pathname),
        });
      }}
      {...resetProps}
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

MainDrawerMenu.Footer = function MainDrawerMenuFooter() {
  const year = new Date().getFullYear();
  return (
    <>
      <div className={styles.navigation_footer__links}>
        <a
          href="https://twitter.com/hashnode"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Hashnode on Twitter"
          className={styles.twitter}
        >
          <svg className="icon__base fill-current" viewBox="0 0 512 512">
            <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
          </svg>
        </a>
        <a
          href="https://linkedin.com/company/hashnode"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Hashnode on LinkedIn"
          className={styles.linkedin}
        >
          <svg className="icon__base fill-current" viewBox="0 0 448 512">
            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path>
          </svg>
        </a>
        <a
          href="https://instagram.com/hashnode"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Hashnode on Instagram"
          className={styles.instagram}
        >
          <svg className="icon__base fill-current" viewBox="0 0 24 24">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
        </a>
        <a
          href="https://discord.gg/hashnode"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join Hashnode's Discord Community"
          className={styles.discord}
        >
          <svg className="icon__base fill-current" viewBox="0 0 448 512">
            <path d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"></path>
          </svg>
        </a>
      </div>
      <p className={styles.navigation_footer__coypright}>© {year} Hashnode</p>
    </>
  );
};
