import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Types, disconnect } from "mongoose";
import { CreateReviewDto } from "src/review/dto/create.review.dto";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import {
  RATING_MAX_VALUE_ERROR,
  RATING_MIN_VALUE_ERROR,
  REVIEW_NOT_FOUND,
} from "./../src/review/review.constants";

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  title: "Title here",
  description: "description here",
  name: "name here",
  productId,
  rating: 5,
};

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

  it("/review/:id (DELETE) - success", () => {
    return request(app.getHttpServer())
      .delete("/review/" + createdId)
      .expect(200);
  });

  it("/review/:id (DELETE) - fail", () => {
    return request(app.getHttpServer())
      .delete("/review/" + new Types.ObjectId().toHexString())
      .expect(HttpStatus.NOT_FOUND, {
        statusCode: HttpStatus.NOT_FOUND,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
