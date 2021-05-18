import { FormEventHandler, useState, useRef } from "react";
import { useRouter } from "next/router";
import { User } from "../../types";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/client";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInput = useRef<HTMLInputElement>();
  const passwordInput = useRef<HTMLInputElement>();
  const router = useRouter();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const createUser = async (user: User) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "something went wrong");
    }

    return data.doc as User;
  };

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const user: User = {
      email: emailInput.current.value,
      password: passwordInput.current.value,
    };

    if (isLogin) {
      /* #TA03
        - the second parameter will be passed in as the parameter
          of the authorize method #REF01
        - don't forget to stringify the user object as signIN is still
          making a http API call            
      */
      const res = await signIn("credentials", {
        redirect: false,
        user: JSON.stringify(user),
      });

      if (!res.error) {
        router.replace("/profile");
      }
    } else {
      try {
        const result = await createUser(user);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInput} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passwordInput} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
