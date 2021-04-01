import { BalanceModel } from "./balance.model";
import { BALANCE_REPOSITORY } from "./constants";

export const BalanceProvider = [
  {
    provide: BALANCE_REPOSITORY,
    useValue: BalanceModel,
  },
];
