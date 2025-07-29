import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from './tasks/tasks.service';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

describe('AppModule', () => {
  let appController: AppController;
  let appService: AppService;
  let taskService: TasksService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
      providers: [],
    }).compile();
    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    taskService = moduleRef.get<TasksService>(TasksService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined with proper elements', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
    expect(taskService).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
