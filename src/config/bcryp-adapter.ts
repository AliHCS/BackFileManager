import { compare, compareSync, genSaltSync, hashSync } from "bcrypt";

export const bcrypAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync();
    return hashSync(password, salt);
  },

  compare: (password: string, passwordHash: string) => {
    return compareSync(password, passwordHash);
  },
};
