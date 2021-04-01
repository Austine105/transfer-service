import { TransactionModel } from "./transaction.model";
import { TRANSACTION_REPOSITORY } from "./constants";

export const TransactionProvider = [
  {
    provide: TRANSACTION_REPOSITORY,
    useValue: TransactionModel,
  },
];
