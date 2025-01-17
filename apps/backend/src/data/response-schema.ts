import { z } from 'zod';

// Base schemas
const nullableString = z.string().nullable();

// Table related schemas
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

// Business metrics schemas
const revenueSchema = sectionWithTableSchema(
  'Commentary on revenue metrics including MRR, ARR, and revenue growth.',
);

const customerSchema = sectionWithTableSchema(
  'Commentary on customer metrics including total customers, new customers, and customer segments.',
);

const churnSchema = sectionWithTableSchema(
  'Commentary on churn metrics including customer churn rate, revenue churn rate, and retention.',
);

const profitAndBurnSchema = sectionWithTableSchema(
  'Commentary on financial health including gross profit, burn rate, cash position, and runway.',
);

const pipelineSchema = sectionWithTableSchema(
  'Commentary on sales pipeline including opportunities, conversion rates, and deal values.',
);

const unitEconomicsSchema = sectionWithTableSchema(
  'Commentary on unit economics including CAC, LTV, payback period, and gross margins.',
);

// Product and summary schemas
const productDevelopmentSchema = z
  .object({
    developments: nullableString.describe(
      'Recent product developments, launches, and major feature releases.',
    ),
    usageStats: nullableString.describe(
      'Key product usage metrics including MAU, DAU, and engagement rates.',
    ),
    specificMetrics: nullableString.describe(
      'Product-specific KPIs and performance metrics.',
    ),
  })
  .nullable();

const summarySchema = z
  .object({
    highlights: nullableString.describe(
      'Key achievements, milestones, and important announcements for the period.',
    ),
    learnings: nullableString.describe(
      'Strategic insights, challenges overcome, and key learnings from the period.',
    ),
  })
  .nullable();

const signatureSchema = z
  .object({
    name: nullableString.describe(
      'Name of the report author or responsible executive.',
    ),
    position: nullableString.describe('Position or title of the signer.'),
  })
  .nullable();

// Report structure schemas
const sectionsSchema = z
  .object({
    summary: summarySchema,
    revenue: revenueSchema,
    customer: customerSchema,
    churn: churnSchema,
    profitAndBurn: profitAndBurnSchema,
    pipeline: pipelineSchema,
    productDevelopment: productDevelopmentSchema,
    unitEconomics: unitEconomicsSchema,
  })
  .nullable();

const reportTitleSchema = nullableString.describe(
  "The title of the report, e.g., 'Swerve Investor Report - September 2024 🚀'",
);

const highlightedSectionSchema = nullableString.describe(
  "The currently highlighted section of the report, e.g., 'revenue', or null if empty.",
);

// Response related schemas
const userMessageSchema = z
  .string()
  .describe(
    "Short response to the user's message, addressing their request or feedback.",
  );

const suggestedAnswersSchema = z
  .array(z.string())
  .describe(
    "Suggested short user inputs to guide the flow, e.g., 'Proceed', 'Fix manually'.",
  );

const reportSchema = z
  .object({
    title: reportTitleSchema,
    currentlyHighlightedSection: highlightedSectionSchema,
    sections: sectionsSchema,
    signature: signatureSchema,
  })
  .nullable();

export const responseSchema = z.object({
  report: reportSchema,
  userMessage: userMessageSchema,
  suggestedAnswers: suggestedAnswersSchema,
});
