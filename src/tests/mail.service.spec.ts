import { BullModule, getQueueToken } from "@nestjs/bull";
import { Test, TestingModule } from "@nestjs/testing";
import { Queue } from "bull";
import { MailService } from "src/mail/services";
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from "../mail/constants";


describe("MailService", () => {
  let service: MailService;
  let moduleRef: TestingModule;

  const exampleQueueMock = { add: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    moduleRef = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: MAIL_QUEUE,
        }),
      ],
      providers: [MailService],
    })
      .overrideProvider(getQueueToken(MAIL_QUEUE))
      .useValue(exampleQueueMock)
      .compile();

    service = moduleRef.get<MailService>(MailService);
  });

  it("should inject the queue", () => {
    const queue = moduleRef.get<Queue>(getQueueToken(MAIL_QUEUE));

    expect(queue).toBeDefined();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should dispatch job", async () => {
    await service.sendRegistrationEmail("test@test.com", "http://link.com?token=ey");

    expect(exampleQueueMock.add).toHaveBeenCalledWith(CONFIRM_REGISTRATION, {
      confirmUrl: "http://link.com?token=ey",
      emailAddress: "test@test.com",
    });
  });
});