import { describe,expect,it } from "vitest";
import { authSchema,launchSchema,outputSectionsSchema } from "@/lib/schemas";

describe("validation",()=>{
  it("rejects weak credentials",()=>expect(authSchema.safeParse({email:"bad",password:"short"}).success).toBe(false));
  it("accepts a structured output",()=>expect(outputSectionsSchema.safeParse({sections:[{title:"Hook",body:"Clear copy"}]}).success).toBe(true));
  it("rejects unsafe product URLs",()=>expect(launchSchema.safeParse({brandName:"Brand",brandTone:"Bold",targetAudience:"A specific audience",launchGoal:"Drive qualified sales",productName:"Product",productCategory:"Category",productDescription:"A useful product description",keyFeatures:"Feature",price:"$20",competitorLink:"javascript:alert(1)"}).success).toBe(false));
});
