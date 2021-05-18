import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { findUser, updatePassword } from "../../../util/db";
import { verifyPassword, hashPassword } from "../../../util/auth";
import { PasswordChange } from "../../../types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") return;

  const session = await getSession({ req });

  /* #TA08 */
  if (!session) {
    res.status(401).json({ message: "not authenticated" });
    return;
  }

  const change = req.body as PasswordChange;

  if (!change) {
    res.status(400).json({ message: "bad request" });
    return;
  }

  if (!change.newPassword || change.newPassword.trim().length < 7) {
    res
      .status(422)
      .json({ message: "new password needs to have more than 6 characters" });
    return;
  }

  if (!session.user || !session.user.email) {
    res.status(401).json({ message: "unable to identify the current user" });
    return;
  }

  const found = await findUser(session.user.email);

  if (found.hasError) {
    res.status(500).json({ message: found.message });
    return;
  }

  if (!found.result) {
    res.status(404).json({ message: "unable to find user" });
    return;
  }

  const pass = await verifyPassword(change.oldPassword, found.result.password);

  if (!pass) {
    res.status(403).json({ message: "wrong current password provided" });
    return;
  }

  const newHashed = await hashPassword(change.newPassword);

  const result = await updatePassword(found.result._id, newHashed);

  if (result.hasError) {
    res.status(500).json({ message: result.message });
    return;
  }

  res.status(200).json({ message: "password updated" });
};

export default handler;
