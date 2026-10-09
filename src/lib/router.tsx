import React, { createContext, useContext } from 'react';

/** Tiny router context — the app already uses history.pushState; this just
 *  lets every link be a real, crawlable <a href> that navigates client-side. */
type RouterValue = { path: string; navigate: (to: string) => void };
const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

export const RouterProvider = RouterContext.Provider;
export const useRouter = () => useContext(RouterContext);

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { path, navigate } = useRouter();
  const external = /^(https?:|mailto:|tel:)/.test(to);
  return (
    <a
      href={to}
      aria-current={!external && path === to ? 'page' : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (external || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
