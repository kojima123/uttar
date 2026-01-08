import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { sharedRecords } from "../drizzle/schema";

describe("Shared Timeline", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    // Create a caller with mock context
    caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      user: undefined,
    });

    // Clear the shared_records table before each test
    const db = await getDb();
    if (db) {
      try {
        await db.delete(sharedRecords);
        // Wait a bit to ensure deletion is complete
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error('Failed to clear database:', error);
      }
    }
  });

  it("should add a shared record", async () => {
    const result = await caller.shared.add({
      nickname: "テストユーザー",
      area: "abdomen",
      side: "right",
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve shared records", async () => {
    // Add a few records
    await caller.shared.add({
      nickname: "ユーザー1",
      area: "abdomen",
      side: "left",
    });

    await caller.shared.add({
      nickname: "ユーザー2",
      area: "thigh",
      side: "right",
    });

    const records = await caller.shared.list();

    expect(records.length).toBeGreaterThanOrEqual(2);
    expect(records[0]).toHaveProperty("nickname");
    expect(records[0]).toHaveProperty("area");
    expect(records[0]).toHaveProperty("side");
    expect(records[0]).toHaveProperty("createdAt");
  });

  it("should maintain only 30 records", async () => {
    // Add 32 records (smaller number to avoid timeout)
    for (let i = 0; i < 32; i++) {
      await caller.shared.add({
        nickname: `Test${i}`,
        area: "abdomen",
        side: i % 2 === 0 ? "left" : "right",
      });
    }

    const records = await caller.shared.list();

    // Should only have 30 records
    expect(records.length).toBeLessThanOrEqual(30);
  }, 15000); // Increase timeout to 15 seconds

  it("should order records by newest first", async () => {
    await caller.shared.add({
      nickname: "FirstUser",
      area: "abdomen",
      side: "left",
    });

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 200));

    await caller.shared.add({
      nickname: "SecondUser",
      area: "thigh",
      side: "right",
    });

    const records = await caller.shared.list();

    // The newest record should be first
    expect(records.length).toBeGreaterThanOrEqual(2);
    expect(records[0].nickname).toBe("SecondUser");
    expect(records[1].nickname).toBe("FirstUser");
  });

  it("should handle anonymous nickname", async () => {
    const result = await caller.shared.add({
      nickname: "Anonymous",
      area: "arm",
      side: "left",
    });

    expect(result.success).toBe(true);

    const records = await caller.shared.list();
    const found = records.find(r => r.nickname === "Anonymous");
    expect(found).toBeDefined();
    expect(found?.area).toBe("arm");
    expect(found?.side).toBe("left");
  });
});
