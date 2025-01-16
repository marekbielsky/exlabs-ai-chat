import { z } from 'zod';

const nullableString = z.string().nullable();

// Common schemas
const tableSchema = z
  .object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  })
  .nullable();

const sectionWithTableSchema = (description: string) =>
  z
    .object({
      description: nullableString.describe(description),
      table: tableSchema,
    })
    .nullable();

const summarySchema = z
  .object({
    highlights: nullableString.describe(
      "What's gone well and key announcements",
    ),
    learnings: nullableString.describe(
      'Positive reflections on challenges and learnings',
    ),
  })
  .nullable();

const productDevelopmentSchema = z
  .object({
    developments: nullableString.describe(
      'Recent product developments and achievements.',
    ),
    usageStats: nullableString.describe('Key usage statistics.'),
    specificMetrics: nullableString.describe('Manual input product metrics.'),
  })
  .nullable();

const signatureSchema = z
  .object({
    name: nullableString.describe('Name of the signer.'),
    position: nullableString.describe('Position of the signer.'),
  })
  .nullable();

// Main report sections schema
const sectionsSchema = z
  .object({
    summary: summarySchema,
    revenue: sectionWithTableSchema('Commentary on revenue metrics.'),
    customer: sectionWithTableSchema('Commentary on customer growth.'),
    churn: sectionWithTableSchema('Commentary on churn metrics.'),
    profitAndBurn: sectionWithTableSchema(
      'Commentary on profit, burn, working capital, and runway metrics.',
    ),
    pipeline: sectionWithTableSchema('Commentary on pipeline metrics.'),
    productDevelopment: productDevelopmentSchema,
    unitEconomics: sectionWithTableSchema('Commentary on unit economics.'),
  })
  .nullable();

// Main response schema
export const responseSchema = z.object({
  report: z
    .object({
      title: nullableString.describe(
        "The title of the report, e.g., 'Swerve Investor Report - September 2024 🚀'",
      ),
      currentlyHighlightedSection: nullableString.describe(
        "The currently highlighted section of the report, e.g., 'revenue', or null if empty.",
      ),
      sections: sectionsSchema,
      signature: signatureSchema,
    })
    .nullable(),
  userMessage: z
    .string()
    .describe(
      "Short response to the user's message, addressing their request or feedback.",
    ),
  suggestedAnswers: z
    .array(z.string())
    .describe(
      "Suggested short user inputs to guide the flow, e.g., 'Proceed', 'Fix manually'.",
    ),
});
