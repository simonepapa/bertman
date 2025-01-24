import ThemeToggler from "./ThemeToggler"
import {
  UserCircleIcon,
  BookOpenIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline"
import {
  Bars3Icon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon
} from "@heroicons/react/24/solid"
import { NavLink } from "react-router-dom"

function Navbar() {
  return (
    <div className="drawer">
      <input id="menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar w-full bg-base-100 px-6 shadow">
          <div className="flex-1">
            <NavLink to="/" className="logo px-0 text-xl font-bold">
              jOURney
            </NavLink>
            <div className="hidden flex-none xl:block">
              <ul className="menu menu-horizontal">
                <li>
                  <NavLink
                    to="/new-listing"
                    className="btn btn-ghost no-underline">
                    Post new listing
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/listings"
                    className="btn btn-ghost no-underline">
                    Explore published listings
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-none xl:hidden">
            <label
              htmlFor="menu"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost size-6">
              <Bars3Icon />
            </label>
          </div>
          <div className="hidden gap-4 xl:flex">
            <NavLink to="/profile" className="btn btn-ghost">
              <UserCircleIcon className="flex-end size-8" />
              Profile
            </NavLink>
            <NavLink to="/sign-in" className="btn btn-ghost">
              Sign in
            </NavLink>
            <NavLink to="/sign-up" className="btn btn-primary">
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="menu"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 items-start bg-base-200 p-4">
          <li>
            <NavLink to="/sign-up" className="font-normal no-underline">
              <UserPlusIcon className="size-6" />
              Sign up
            </NavLink>
          </li>
          <li>
            <NavLink to="/sign-in" className="font-normal no-underline">
              <ArrowRightStartOnRectangleIcon className="size-6" />
              Sign in
            </NavLink>
          </li>

          <li>
            <NavLink to="/profile" className="font-normal no-underline">
              <UserCircleIcon className="size-6" />
              Profile
            </NavLink>
          </li>
          <div className="divider my-0"></div>
          <li>
            <NavLink to="/new-listing" className="font-normal no-underline">
              <PlusIcon className="size-6" />
              Post new listing
            </NavLink>
          </li>
          <li>
            <NavLink to="/listings" className="font-normal no-underline">
              <BookOpenIcon className="size-6" />
              Explore published listings
            </NavLink>
          </li>
          <li className="mt-auto xl:hidden">
            <ThemeToggler />
          </li>
        </ul>
      </div>
    </div>
  )
}
export default Navbar
