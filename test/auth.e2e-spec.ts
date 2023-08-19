import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { disconnect } from "mongoose";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { USER_NOT_EXIST_ERROR } from "../src/modules/auth/auth.constants";
import { AuthDto } from "../src/modules/auth/dto/auth.dto";

const loginDto: AuthDto = {
  login: "a@m.com",
  password: "123",
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("auth/login (POST) - success", (done) => {
    request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)
      .expect(200)
      .then(({ body }) => {
        expect(body.access_token).toBeDefined();
        done();
      });
  });

  it("auth/login (POST) - fail login", (done) => {
    request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginDto, login: "a2@m.com" })
      .expect(401, {
        message: USER_NOT_EXIST_ERROR,
        error: "Unauthorized",
        statusCode: 401,
      })
      .then(() => done());
  });

  it("auth/login (POST) - fail password", (done) => {
    request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginDto, password: "1234" })
      .expect(401, {
        message: USER_NOT_EXIST_ERROR,
        error: "Unauthorized",
        statusCode: 401,
      })
      .then(() => done());
  });

  afterAll(() => {
    disconnect();
  });
});
