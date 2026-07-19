import { describe,expect,it } from "vitest";
import { startOfMonth } from "@/lib/time";
describe("startOfMonth",()=>{it("uses UTC boundaries",()=>expect(startOfMonth(new Date("2026-07-19T12:00:00Z")).toISOString()).toBe("2026-07-01T00:00:00.000Z"));});
