import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon, GiftIcon, HomeIcon, SparklesIcon, StarIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary " : ""
      } hover:bg-secondary-90  focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const navLinks = (
    <>
      <li className="text-md font-semibold">
        <NavLink href="/">
          <HomeIcon className="h-4 w-4" />
          Home
        </NavLink>
      </li>
      <li className="text-md font-semibold">
        <NavLink href="/donate">
          <GiftIcon className="h-4 w-4" />
          Donate and Win
        </NavLink>
      </li>
      <li className="text-md font-semibold">
        <NavLink href="/dashboard">
          <StarIcon className="h-4 w-4" />
          Dashboard
        </NavLink>
      </li>
      <li className="text-md font-semibold">
        <NavLink href="/register">
          <SparklesIcon className="h-4 w-4" />
          Register your organization
        </NavLink>
      </li>
    </>
  );

  // const devLinks = (
  //   <>
  //     <li>
  //       <NavLink href="/debug">Debug Contract</NavLink>
  //     </li>
  //     <li>
  //       <NavLink href="/blockexplorer">Block Explorer</NavLink>
  //     </li>
  //   </>
  // );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 w-full border-b-2 border-l-2 border-r-2 border-black rounded-b-2xl self-center justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks}
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-8 h-8">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/orange_heart.png" />
          </div>
          <span className="font-bold text-lg leading-tight">Spin For Good</span>
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks}</ul>
        {/* <div className="dropdown" ref={burgerMenuRef}>
          <label tabIndex={0} className={`ml-1 btn btn-ghost "hover:bg-secondary`}>
            <Bars3Icon className="h-1/2" />
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            {devLinks}
          </ul>
        </div> */}
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        {false && <FaucetButton />}
      </div>
    </div>
  );
};
