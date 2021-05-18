import { getSession } from "next-auth/client";
import { useState, useEffect } from "react";
import { PasswordChange } from "../../types";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

const UserProfile = () => {
  /* #TA05
     - use getSession instead of useSession
       so we can set the isLoading correctly 
  */
  const [isLoading, setIsLoading] = useState(true);

  /*
    - this is not really needed as the redirect
      is handled in the getServerSideProps in
      the profile.tsx #REF03
  */
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        window.location.href = "/auth";
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  if (isLoading) {
    return <p className={classes.profile}>Loading...</p>;
  }

  const changePassword = async (pwdChange: PasswordChange) => {
    const res = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(pwdChange),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePassword} />
    </section>
  );
};

export default UserProfile;
