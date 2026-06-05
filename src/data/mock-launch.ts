import type { LaunchAction, LaunchActionId, LaunchFormData, OutputSection } from "@/types/launch";

export const sampleLaunch: LaunchFormData = {
  brandName: "LaunchPilot Naturals",
  brandTone: "Premium",
  targetAudience: "Busy skincare shoppers in their late 20s to early 40s who want a simple, trustworthy glow routine.",
  launchGoal: "Drive first-month Shopify sales and build an email list before launch day.",
  productName: "Radiance Reset Vitamin C Serum",
  productCategory: "Skincare serum",
  productDescription:
    "A lightweight vitamin C serum with hyaluronic acid and niacinamide designed to brighten dull skin, smooth texture, and layer easily under moisturizer or SPF.",
  keyFeatures:
    "Stable vitamin C blend, hyaluronic acid hydration, niacinamide for tone, fragrance-free, recyclable glass bottle",
  price: "$42",
  imageNames: ["serum-front.jpg", "texture-swatch.jpg"],
  competitorLink: "https://example.com/competitor-serum",
  existingProductUrl: "https://example.com/radiance-reset",
  specialNotes:
    "The formula is made for sensitive skin and uses a fast-absorbing texture that does not pill under makeup.",
};

export const launchActions: LaunchAction[] = [
  {
    id: "listing",
    title: "Optimize Product Listing",
    description: "Turn product details into a sharper Shopify title, hook, bullets, and conversion-focused CTA.",
    buttonLabel: "Build listing",
  },
  {
    id: "positioning",
    title: "Find the Best Positioning Angle",
    description: "Compare audience-ready angles so the product has a clear reason to buy now.",
    buttonLabel: "Find angle",
  },
  {
    id: "campaign",
    title: "Create Launch Campaign Content",
    description: "Draft email, paid ad, and social copy for a coordinated launch moment.",
    buttonLabel: "Create content",
  },
  {
    id: "creative",
    title: "Generate Ad Creative Concepts",
    description: "Map out scroll-stopping creative concepts with visual direction and messaging.",
    buttonLabel: "Generate concepts",
  },
];

export const mockOutputs: Record<LaunchActionId, OutputSection[]> = {
  listing: [
    { title: "Product Title", body: "Radiance Reset Vitamin C Serum for Brighter, Smoother-Looking Skin" },
    { title: "Hero Hook", body: "A daily glow serum for skin that looks tired before your calendar does." },
    {
      title: "Description",
      body:
        "Radiance Reset is a lightweight vitamin C serum made for everyday brightness without the heavy, sticky finish. The formula pairs a stable vitamin C blend with hyaluronic acid and niacinamide to support a hydrated, even-looking glow that layers cleanly under moisturizer, SPF, and makeup.",
    },
    {
      title: "Bullet Points",
      body: [
        "Brightens the look of dull, uneven skin with a stable vitamin C blend.",
        "Hydrates with hyaluronic acid while keeping the finish light and fast absorbing.",
        "Supports smoother-looking tone and texture with niacinamide.",
        "Fragrance-free formula made for sensitive daily routines.",
      ],
    },
    { title: "CTA", body: "Reset your morning glow" },
  ],
  positioning: [
    {
      title: "Angle 1: The Workday Glow Reset",
      body: "Position the serum as a simple morning step for shoppers who want skin that looks rested before a busy day starts.",
    },
    {
      title: "Angle 2: Sensitive-Skin Brightening",
      body: "Lead with confidence and comfort: brightening benefits without fragrance or a heavy feel.",
    },
    {
      title: "Angle 3: Makeup-Friendly Skincare",
      body: "Highlight the fast-absorbing texture that layers under SPF and makeup without pilling.",
    },
    {
      title: "Angle 4: Premium Routine Simplifier",
      body: "Frame it as a refined multi-benefit serum that replaces a crowded shelf with one daily brightening step.",
    },
  ],
  campaign: [
    {
      title: "Launch Email Draft",
      body:
        "Subject: Your glow reset starts today\n\nMeet Radiance Reset, our lightweight vitamin C serum for brighter, smoother-looking skin without the sticky finish. It layers under SPF, wears beautifully with makeup, and fits into the morning routine you already have.\n\nLaunch week offer: get 15% off your first bottle through Sunday.",
    },
    {
      title: "Paid Ad Copy",
      body: "Dull skin before 9am? Reset the look of tired skin with a lightweight vitamin C serum made for busy mornings. Brightening, hydrating, fragrance-free.",
    },
    {
      title: "Social Caption",
      body: "The serum step that plays well with your real routine: vitamin C, hyaluronic acid, niacinamide, and zero sticky finish. Launch week is live.",
    },
  ],
  creative: [
    {
      title: "Concept 1: Morning Mirror Proof",
      body: "Show a clean bathroom counter, one pump of serum, and a close-up of skin after SPF. Visual direction: bright natural light, crisp product macro, minimal props.",
    },
    {
      title: "Concept 2: No-Pill Layer Test",
      body: "Demonstrate serum, moisturizer, SPF, and makeup layering smoothly. Visual direction: split-screen application with text callouts for each layer.",
    },
    {
      title: "Concept 3: Desk-To-Dinner Glow",
      body: "Follow a founder-style daily routine from morning desk setup to evening plans. Visual direction: refined lifestyle footage with product always visible.",
    },
    {
      title: "Concept 4: Ingredient Trio",
      body: "Animate vitamin C, hyaluronic acid, and niacinamide as the three reasons to believe. Visual direction: clean ingredient cards, glass bottle macro, soft shadows.",
    },
  ],
};
