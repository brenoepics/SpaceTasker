import type { FC, PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import classNames from "classnames";

const NavbarSidebarLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex items-start pt-16 bg-transparent">
        <MainContent>{children}</MainContent>
      </div>
    </>
  );
};

const MainContent: FC<PropsWithChildren> = function ({ children }) {
  return (
    <main
      className={classNames(
        "overflow-y-auto relative w-full h-full bg-transparent"
      )}
    >
      {children}
    </main>
  );
};

export default NavbarSidebarLayout;
