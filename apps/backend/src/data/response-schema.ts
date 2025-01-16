import { z } from 'zod';

const nullableString = z.string().nullable();

const tableSchema = z
  .object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  })
  .nullable();

export const responseSchema = z.object({
  report: z
    .object({
      title: nullableString.describe(
        "The title of the report, e.g., 'Swerve Investor Report - September 2024 🚀'",
      ),
      currentlyHighlightedSection: nullableString.describe(
        "The currently highlighted section of the report, e.g., 'revenue', or null if empty.",
      ),
      sections: z
        .object({
          summary: z
            .object({
              highlights: nullableString.describe(
                "What's gone well and key announcements",
              ),
              learnings: nullableString.describe(
                'Positive reflections on challenges and learnings',
              ),
            })
            .nullable(),
          revenue: z
            .object({
              description: nullableString.describe(
                'Commentary on revenue metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          customer: z
            .object({
              description: nullableString.describe(
                'Commentary on customer growth.',
              ),
              table: tableSchema,
            })
            .nullable(),
          churn: z
            .object({
              description: nullableString.describe(
                'Commentary on churn metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          profitAndBurn: z
            .object({
              description: nullableString.describe(
                'Commentary on profit and burn metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          pipeline: z
            .object({
              description: nullableString.describe(
                'Commentary on pipeline metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          productDevelopment: z
            .object({
              developments: nullableString.describe(
                'Recent product developments and achievements.',
              ),
              usageStats: nullableString.describe('Key usage statistics.'),
              specificMetrics: nullableString.describe(
                'Manual input product metrics.',
              ),
            })
            .nullable(),
          unitEconomics: z
            .object({
              description: nullableString.describe(
                'Commentary on unit economics.',
              ),
              table: tableSchema,
            })
            .nullable(),
        })
        .nullable(),
      signature: z
        .object({
          name: nullableString.describe('Name of the signer.'),
          position: nullableString.describe('Position of the signer.'),
        })
        .nullable(),
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
