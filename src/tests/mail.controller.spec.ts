import { BullModule, getQueueToken } from "@nestjs/bull";
import { Test, TestingModule } from "@nestjs/testing";
import { MAIL_QUEUE } from "../mail/constants";
import { MailController } from "../mail/controllers";
import { MailService } from "src/mail/services/mail.service";

describe("MailController", () => {
  let controller: MailController;
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
      controllers: [MailController],
      providers: [MailService],
    })
      .overrideProvider(getQueueToken(MAIL_QUEUE))
      .useValue(exampleQueueMock)
      .compile();

    controller = moduleRef.get<MailController>(MailController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});