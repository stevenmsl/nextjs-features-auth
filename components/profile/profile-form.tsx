import { FormEventHandler, useRef } from "react";
import { PasswordChange } from "../../types";
import classes from "./profile-form.module.css";

interface ProfileFormProps {
  onChangePassword: (passwordChange: PasswordChange) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onChangePassword }) => {
  const newPassword = useRef<HTMLInputElement>();
  const oldPassword = useRef<HTMLInputElement>();

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const pwdChange: PasswordChange = {
      newPassword: newPassword.current.value,
      oldPassword: oldPassword.current.value,
    };
    onChangePassword(pwdChange);
  };

  return (
    <form className={classes.form} onSubmit={submit}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPassword} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
