import { Result } from '../result';

export enum SchedulerNames {
  SCHEDULED_PUSH_NOTIFICATION = 'scheduled-push-notification',
}

export interface CronJobCreateInput {
  name: SchedulerNames;
  cronExpression: string;
  cronAction: () => void | Promise<void>;
}

export interface CronJobReference {
  name: SchedulerNames;
  running: boolean;
}

export abstract class SchedulerEntity {
  abstract addCronJob(cronJob: CronJobCreateInput): void;
  abstract removeCronJobByName(name: SchedulerNames): void;
  abstract getAllCronJobs(): CronJobReference[];
  abstract getCronJobByName(name: SchedulerNames): CronJobReference;
  abstract removeAllCronJobs(): void;
}
