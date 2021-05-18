import Link from "next/link";
import { useSession, signOut } from "next-auth/client";
import classes from "./main-navigation.module.css";
import { MouseEventHandler } from "react";

const MainNavigation = () => {
  /* #TA04 */
  const [session, loading] = useSession();

  const logout: MouseEventHandler<HTMLButtonElement> = () => {
    /*
      - you don't really need to wait for it as
        once the process is completed, session 
        will be null, and this component will be 
        re-rendered
    */
    signOut();
  };

  /* #TA04
    - check seesion to decide what to show or hide 
  */
  return (
    <header className={classes.header}>
      <Link href="/">
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && !loading && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
