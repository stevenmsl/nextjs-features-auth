import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { User } from "../../../types";
import { findUser } from "../../../util/db";
import { verifyPassword } from "../../../util/auth";
/* #TA01
  - needs to be a catch-all route
  - check the doc to make sure there is no collision
    if your want to add your own routes   
*/
export default NextAuth({
  session: { jwt: true },
  providers: [
    /* #TA02

    */
    Providers.Credentials({
      /* #REF01, #TA02
         - credentials is coming from the client making
           the signIn call #REF02
         - make sure you re-construct the user object
         - return an object that includes the data you
           want to include in the token
      */
      authorize: async (credentials) => {
        const user = JSON.parse(credentials["user"]) as User;
        if (!user) throw Error("can't access user object");

        const found = await findUser(user.email);
        if (found.hasError) throw Error(found.message);

        if (!found.result) throw Error("Account does not exist");

        const pass = await verifyPassword(user.password, found.result.password);

        if (!pass) throw Error("Invalid password");

        /* only include email in the token */
        return { email: user.email };
      },
    }),
  ],
});
