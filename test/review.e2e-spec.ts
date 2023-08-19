import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Types, disconnect } from "mongoose";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { AuthDto } from "../src/auth/dto/auth.dto";
import { CreateReviewDto } from "../src/review/dto/create.review.dto";
import {
  RATING_MAX_VALUE_ERROR,
  RATING_MIN_VALUE_ERROR,
  REVIEW_NOT_FOUND,
} from "../src/review/review.constants";

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  title: "Title here",
  description: "description here",
  name: "name here",
  productId,
  rating: 5,
};

const loginDto: AuthDto = {
  login: "a@m.com",
  password: "123",
};

describe("ReviewController (e2e)", () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto);

    token = response.body.access_token;
  });

  it("/review/create (POST) - success", (done) => {
    request(app.getHttpServer())
      .post("/review/create")
      .send(testDto)
      .expect(201)
      .then(({ body }) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it("/review/create (POST) - fail min length", (done) => {
    request(app.getHttpServer())
      .post("/review/create")
      .send({ ...testDto, rating: 0 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message?.[0]).toBe(RATING_MIN_VALUE_ERROR);
        done();
      });
  });

  it("/review/create (POST) - fail max length", (done) => {
    request(app.getHttpServer())
      .post("/review/create")
      .send({ ...testDto, rating: 6 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message?.[0]).toBe(RATING_MAX_VALUE_ERROR);
        done();
      });
  });

  it("/review/byProduct/:productId (GET) - success", (done) => {
    request(app.getHttpServer())
      .get("/review/byProduct/" + productId)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(1);
        done();
      });
  });

  it("/review/byProduct/:productId (GET) - fail", (done) => {
    request(app.getHttpServer())
      .get("/review/byProduct/" + new Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
        done();
      });
  });

  it("/review/:id (DELETE) - success", (done) => {
    request(app.getHttpServer())
      .delete("/review/" + createdId)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(() => done());
  });

  it("/review/:id (DELETE) - fail", (done) => {
    request(app.getHttpServer())
      .delete("/review/" + new Types.ObjectId().toHexString())
      .set("Authorization", `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND, {
        statusCode: HttpStatus.NOT_FOUND,
        message: REVIEW_NOT_FOUND,
      })
      .then(() => done());
  });

  afterAll(() => {
    disconnect();
  });
});
