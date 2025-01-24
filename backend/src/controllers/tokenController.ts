import { Token } from "../models";

export const tokenAddRecord = async (token: string, userId: number) => {
  await Token.create({ token, userId });
};

export const tokenRevokeByUser = async (userId: number) => {
  await Token.destroy({ where: { userId: userId } });
};

export const tokenRemoveRecord = async (token: string) => {
  await Token.destroy({ where: { token: token } });
};

export const tokenHasToken = async (token: string) => {
  const tokenRecord = await Token.findOne({ where: { token: token } });
  return !!tokenRecord;
};
