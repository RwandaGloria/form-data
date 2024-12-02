import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { Department, IUser } from "../models/user";

const testURL = "mongodb+srv://rwandagloria:YphxOTukxcCEqhzk@form-d.inpmb.mongodb.net/";

beforeAll(async () => {
    await mongoose.connect(testURL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("UserController Routes", () => {
    let newUserId: string;

    test("POST /add - Should create a new user with valid data and return 201 status", async () => {
        const newUser = {
            firstName: "John",
            lastName: "Jude",
            dateOfBirth: "02-09-1994",
            email: "johndoe@example.com",
            department: "HR"
        };

        const response = await request(app)
            .post("/add")
            .send(newUser)
            .expect(201);

        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.message).toBe("User data created successfully");
        
        newUserId = response.body.data._id;

        expect(response.body.data.firstName).toBe(newUser.firstName);
        expect(response.body.data.lastName).toBe(newUser.lastName);
        expect(response.body.data.email).toBe(newUser.email);
        expect(response.body.data.department).toBe(newUser.department);
    });

    test("GET /list - Should fetch all users and return 200 status with a valid array", async () => {
        const response = await request(app)
            .get("/list")
            .expect(200);

        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.message).toBe("User data retrieved successfully");

        expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("PATCH /update - Should update the user data and return 200 status with updated information", async () => {
        const updatedUserData = {
            userId: newUserId,
            name: "John Doe Updated",
            email: "updated@example.com",
        };

        const response = await request(app)
            .patch("/update")
            .send(updatedUserData)
            .expect(200);

        expect(response.body.data.name).toBe(updatedUserData.name);
        expect(response.body.data.email).toBe(updatedUserData.email);
        expect(response.body.message).toBe("User updated successfully");

        const updatedUser = response.body.data;
        expect(updatedUser.name).toBe(updatedUserData.name);
        expect(updatedUser.email).toBe(updatedUserData.email);
        expect(updatedUser._id).toBe(newUserId);
    });

    test("DELETE /remove - Should delete the user and return 200 status with a success message", async () => {
        const response = await request(app)
            .delete(`/remove?userId=${newUserId}`)
            .expect(200);

        expect(response.body.data._id).toBe(newUserId);
        expect(response.body.message).toBe("User deleted successfully");

        const getUserResponse = await request(app)
            .get(`/list`)
            .expect(200);

        const deletedUser = getUserResponse.body.data.find((user: IUser) => user._id === newUserId);
        expect(deletedUser).toBeUndefined();
    });

    test("POST /add - Should return 409 for duplicate email and provide a descriptive message", async () => {
        const duplicateUser = {
            firstName: "Jane",
            lastName: "Doe",
            dateOfBirth: "03-05-1992",
            email: "johndoe@example.com",
            department: "Finance"
        };

        const response = await request(app)
            .post("/add")
            .send(duplicateUser)
            .expect(409);

        expect(response.body.message).toContain("Duplicate entry for email");
        expect(response.body.message).toContain("johndoe@example.com");

        const userCount = await request(app).get("/list");
        const originalCount = userCount.body.data.length;

        expect(originalCount).toBeGreaterThanOrEqual(1);
    });
});
