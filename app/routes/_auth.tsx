import classNames from "classnames";

// components
import { Icons } from "~/components/shared/Icons";

// remix
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/cloudflare";
import { useCallback, useMemo } from "react";

// constants
import { PAGE_ENDPOINTS } from "~/constants/constant";
import { mergeMeta } from "~/libs/server/merge-meta";

// styles
import authStyles from "~/styles/routes/auth.css";

// types
import type { LinksFunction, LoaderArgs } from "@remix-run/cloudflare";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: authStyles }];
};

export const loader = async ({ context, request }: LoaderArgs) => {
  const isAuthenticated = await context.api.user.isAuthenticated(request);
  if (isAuthenticated) {
    return redirect(PAGE_ENDPOINTS.ROOT);
  }
  return null;
};

export type AuthLoader = typeof loader;

export const meta = mergeMeta<AuthLoader>(
  // these will override the parent meta
  ({ data, location }) => {
    const Seo = {
      signin: "Sign in to Hashnode",
      signup: "Sign up to Hashnode",
      description:
        "Start your programming blog. Share your knowledge and build your own brand",
    };
    const isSigninPage = location.pathname === PAGE_ENDPOINTS.AUTH.SIGNIN;
    const title = isSigninPage ? Seo.signin : Seo.signup;
    return [
      {
        title,
      },
      {
        name: "description",
        content: Seo.description,
      },
      {
        name: "og:title",
        content: title,
      },
      {
        name: "og:description",
        content: Seo.description,
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: Seo.description,
      },
    ];
  }
);

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSigninPage = useMemo(() => {
    return location.pathname === PAGE_ENDPOINTS.AUTH.SIGNIN;
  }, [location]);

  const onClick = useCallback(() => {
    navigate(PAGE_ENDPOINTS.ROOT);
  }, [navigate]);

  return (
    <div
      className={classNames({
        "signup-page": !isSigninPage,
      })}
    >
      <header
        className={classNames({
          "auth-header__signin": isSigninPage,
          "auth-header__signup": !isSigninPage,
        })}
      >
        <Icons.Logo onClick={onClick} className="h-8 cursor-pointer" />
      </header>
      <Outlet />
    </div>
  );
}
