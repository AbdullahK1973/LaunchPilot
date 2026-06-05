export type BrandTone = "Premium" | "Friendly" | "Bold" | "Clinical" | "Playful";

export type LaunchFormData = {
  brandName: string;
  brandTone: BrandTone | "";
  targetAudience: string;
  launchGoal: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  keyFeatures: string;
  price: string;
  imageNames: string[];
  competitorLink?: string;
  existingProductUrl?: string;
  specialNotes?: string;
};

export type LaunchActionId =
  | "listing"
  | "positioning"
  | "campaign"
  | "creative";

export type LaunchAction = {
  id: LaunchActionId;
  title: string;
  description: string;
  buttonLabel: string;
};

export type OutputSection = {
  title: string;
  body: string | string[];
};

export type SavedLaunchOutput = {
  id: string;
  actionId: LaunchActionId;
  actionTitle: string;
  sections: OutputSection[];
  note: string;
  savedAt: string;
};
