export enum TaskStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export const TaskStatusList = [
  TaskStatus.PENDING,
  TaskStatus.CANCELLED,
  TaskStatus.COMPLETED,
  TaskStatus.IN_PROGRESS,
];
