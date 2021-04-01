import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionService } from '../transaction.service';

@Processor('transactions')
export class TransactionProcessor {
  constructor(
    private readonly txtnService: TransactionService
    ) { }

  @Process('transfer')
  async processTransaction(txtnJob: Job) {
    
    await this.txtnService.processTxtnJob(txtnJob.data);
  }
}
