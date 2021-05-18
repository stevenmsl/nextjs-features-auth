import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../types";
import { insertUser, findUser } from "../../../util/db";
import { hashPassword } from "../../../util/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return;
  const user = req.body as User;
  const { email, password } = user;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({ message: "invalid input" });
    return;
  }

  user.email = email.trim();

  const found = await findUser(user.email);
  if (found.hasError) {
    res.status(500).json({ message: found.message });
    return;
  }

  if (found.result) {
    res.status(422).json({ message: "account exists" });
    return;
  }

  user.password = await hashPassword(password);

  const result = await insertUser(user);
  if (result.hasError) res.status(500).json({ message: result.message });
  else res.status(201).json({ message: "user created", doc: result.result });
};

export default handler;
