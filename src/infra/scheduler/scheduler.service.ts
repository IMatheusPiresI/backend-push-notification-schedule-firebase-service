import {
  CronJobCreateInput,
  CronJobReference,
  SchedulerEntity,
  SchedulerNames,
} from '@/core/entities/scheduler.entity';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService implements SchedulerEntity {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  addCronJob(cronJob: CronJobCreateInput): void {
    const cronJobAdded = new CronJob(
      cronJob.cronExpression,
      cronJob.cronAction,
    );
    this.schedulerRegistry.addCronJob(cronJob.name, cronJobAdded);

    this.logger.log(`Cron job ${cronJob.name} added and started`);
  }

  removeCronJobByName(name: SchedulerNames): void {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.log(`Cron job ${name} removed`);
  }

  getAllCronJobs(): CronJobReference[] {
    const cronJobs = this.schedulerRegistry.getCronJobs();

    const cronJobsReferences: CronJobReference[] = [];
    for (const cronJob of cronJobs) {
      cronJobsReferences.push({
        name: cronJob[0] as SchedulerNames,
        running: cronJob[1].isActive,
      });
    }

    return cronJobsReferences;
  }

  getCronJobByName(name: SchedulerNames): CronJobReference {
    const cronJob = this.schedulerRegistry.getCronJob(name);
    return {
      name: cronJob[0] as SchedulerNames,
      running: cronJob[1].isActive,
    };
  }

  removeAllCronJobs(): void {
    const cronJobs = this.schedulerRegistry.getCronJobs();
    for (const cronJob of cronJobs) {
      this.schedulerRegistry.deleteCronJob(cronJob[0] as SchedulerNames);
    }
  }

  startCronJob(name: SchedulerNames): void {
    const cronJob = this.schedulerRegistry.getCronJob(name);
    cronJob.start();
    this.logger.log(`Cron job ${name} started`);
  }

  stopCronJob(name: SchedulerNames): void {
    const cronJob = this.schedulerRegistry.getCronJob(name);
    cronJob.stop();
    this.logger.log(`Cron job ${name} stopped`);
  }
}
