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
        "The currently highlighted section of the report, e.g., 'financialHealth', or null if empty.",
      ),
      sections: z
        .object({
          overview: nullableString.describe(
            "Opening salutation to the shareholders, overview and brief summary of the company's performance.",
          ),
          financialHealth: z
            .object({
              description: nullableString.describe(
                'Commentary on financial health.',
              ),
              table: tableSchema,
            })
            .nullable(),
          liquidityMetrics: z
            .object({
              description: nullableString.describe(
                'Commentary on liquidity metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          customerMetrics: z
            .object({
              description: nullableString.describe(
                'Commentary on customer metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          revenueMetrics: z
            .object({
              description: nullableString.describe(
                'Commentary on revenue metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          burnMetrics: z
            .object({
              description: nullableString.describe(
                'Commentary on burn metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
          transactionMetrics: z
            .object({
              description: nullableString.describe(
                'Commentary on transaction metrics.',
              ),
              table: tableSchema,
            })
            .nullable(),
        })
        .nullable(),
      closing: nullableString.describe('Closing remarks of the report.'),
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
