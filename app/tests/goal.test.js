const test = require('supertest');
const app = require('../../server');
const db = require("../models");

const addValues = require("../../addValues");
db.sequelize.sync().then(()=>{
    addValues.create();
      
    if (process.env.TESTING == 'true') {
      addValues.testCreate();
    }
  });

// GET Goal
describe('GET /resume/goal/:id', () => {
  it('Returns status code 200', () => {
    test('Should return status code 200', async () => {
      const res = await request(app.app).post("/resume/goal/1");
      expect(res.statusCode).toBe(200);
    });
  });

  it('Gives a goal id', () => {
    test('Should return a goal with that id', async () => {
      const res = await request(app.app).post("/resume/goal/1");
      expect(res.id).toBe(1);
    });
  });

  it('Gives a user id', () => {
    test('Should return a goal with that user id', async () => {
      const res = await request(app.app).post("/resume/goal/1");
      expect(red.userId).toBe(3);
    });
  });
});

// POST new goal
describe('POST /resume/goal/', () => {
  let id = -1;
  it('Returns Status Code 200', () => {
    test('Returns status code', async () => {
      const res = await request(app.app).post("/resume/goal/user/3").send({
        title: "Goal title",
        description: "Goal description",
        userId: 3
      });
      id = res.id;
      expect(res.statusCode).toBe(200);
    });
  });

  it('Is added to the data base', () => {
    test('Returns a goal with the title, descriptions, and User Id from last POST', async () => {
      const res = await request(app.app).get(`/resume/goal/${id}`);
      expect(res.id).toBe(id);
      expect(res.title).toBe("Goal title");
      expect(res.description).toBe("Goal description");
      expect(res.userId).toBe(3);
    });
  });

  it('Doesn\'t allow for duplicates', () => {
    test('Returns status code 500', async () => {
      const res = await request(app.app).post("/resume/goal/").send({
        title: "Goal title",
        description: "Goal description",
        userId: 3
      });
      id = res.id;
      expect(res.statusCode).toBe(500);
    });
  });

  it('Requires title, description, and userId to be defined', () => {
    test('Returns status code 400 with title null', async () => {
      const res = await request(app.app).post("/resume/goal/").send({
        description: "Goal description",
        userId: 3
      });
      id = res.id;
      expect(res.statusCode).toBe(400);
    });

    test('Returns status code 400 with description null', async () => {
      const res = await request(app.app).post("/resume/goal/").send({
        title: "Goal Title",
        userId: 3
      });
      id = res.id;
      expect(res.statusCode).toBe(400);
    });

    test('Returns status code 500 with userId null', async () => {
      const res = await request(app.app).post("/resume/goal/").send({
        title: "Goal title",
        description: "Goal description"
      });
      id = res.id;
      expect(res.statusCode).toBe(500);
    });
  });
});

// GET all Goals
describe('GET /resume/goal/', () => {
  it('Gives all goals', () => {
    test('Should return an array with a length property', async () => {
      const res = await request(app.app).get("/resume/goal/");
      expect(res.length > 0).toBe(true);
    });
  });
});

// GET all Goals for user
describe('GET /resume/goal/user/:userId', () => {
  it('Returns an array with a length property', () => {
    test('Should return an array with a length property', async () => {
      const res = await request(app.app).get("/resume/goal/user/3");
      expect(res.length > 0).toBe(true);
    });
  });

  it('Gives all goals with a user id', () => {
    test('Should return an array with a length property', async () => {
      const res = await request(app.app).post("/resume/goal/user/3");

      for (let i = 0; i < res.length; i++) {
        expect(res[i].userId).toBe(3);
      }
    });
  });
});

// PUT Goal
describe('PUT /resume/goal/', () => {
  const id = -1;
  it('Updates a goal', () => {
    test('Should return status code 200', async () => {
      const res1 = await request(app.app).get("/resume/goal/");
      id = res1[0].id;
      const res = await request(app.app).put(`/resume/goal/${id}`).send({
        title: "New Goal Title",
        userId: 3
      });
      expect(res.statusCode).toBe(200);
    });

    test('Should return new data', async () => {
      const res = await request(app.app).get(`/resume/goal/${id}`);
      expect(res.title).toBe("New Goal Title");
    });
  });

  it('Cannot update a goal with no user Id', () => {
    test('Returns status code 500 without user Id', async () => {
      const res = await request(app.app).put(`/resume/goal/${id}`).send({
        title: "New Goal Title"
      });
      expect(res.statusCode).toBe(500);
    });
  });

  it('Cannot have duplicates', () => {
    test('Returns status code 500 if title is equal to another goal', async () => {
      const res = await request(app.app).put(`/resume/goal/${id}`).send({
        title: "New Goal Title",
        userId: 3
      });
      expect(res.statusCode).toBe(500);
    });
  });
});

// DELETE a Goal
describe('DELETE /resume/goal/', () => {
  const id = -1;
  it('Returns status code 200 with successful deletion', () => {
    test('Should return status code 200', async () => {
      const res1 = await request(app.app).get("/resume/goal/");
      id = res1[1].id;
      const res = await request(app.app).delete(`/resume/goal/${id}`);
      expect(res.statusCode).toBe(200);
    });
  });

  it('Deletes a goal with id', () => {
    test('Return an empty json object', async () => {
      const res = await request(app.app).get(`/resume/goal/${id}`);
      expect(res).toBe({});
    });
  });
});

// POST AI Assist
describe('POST /resume/goal/assist', () => {
  const id = -1;
  it('Returns status code 200', () => {
    test('Should return status code 200', async () => {
      const res = await request(app.app).delete(`/resume/goal/${id}`).send({
        title: "Software developer",
        experiences: [
          "Website developement",
          "mobile app development"
        ],
        achievements: [
          "Magna cum laude",
          "top of my Computer Science major"
        ]
      });
      expect(res.statusCode).toBe(200);
    });
  });

  it('Returns a message from the chatbot and saves the history', () => {
    test('Return an empty json object', async () => {
      const res = await request(app.app).delete(`/resume/goal/${id}`).send({
        title: "Software developer",
        experiences: [
          "Website developement",
          "mobile app development"
        ],
        achievements: [
          "Magna cum laude",
          "top of my Computer Science major"
        ]
      });
      expect(res.description === "").toBe(false);
      expect(res.chatHistory.length > 0).toBe(true);
    });
  });
});