export const metrics = `
Quarter,Revenue (in billion USD),Cost of Revenue (in billion USD),Gross Profit (in billion USD),Operating Expenses (in billion USD),Operating Income (in billion USD),Net Income (in billion USD),EPS (in USD),Free Cash Flow (in billion USD),R&D Expenses (in billion USD),Sales & Marketing Expenses (in billion USD),General & Admin Expenses (in billion USD),MAU (in billion),DAU (in billion),ARPU (in USD),Engagement Rate (%),Total Ad Impressions (in billion),CTR (%),Customer Satisfaction (CSAT) Score,Churn Rate (%),Customer Acquisition Cost (CAC in USD),Net Promoter Score (NPS),Employee Count,Return on Equity (ROE),Total Assets (in billion USD),Total Liabilities (in billion USD),Equity (in billion USD)
Q3 2024,33.1,8.2,24.9,14.3,10.6,9.9,3.40,11.9,4.9,3.8,1.5,3.00,1.96,10.89,66.0,700,1.2,78,3.1,44,62,86,80,190.8,86.0,104.8
Q2 2024,31.9,8.0,23.9,14.0,9.9,9.4,3.20,11.5,4.8,3.7,1.4,2.98,1.94,10.55,65.5,680,1.1,77,3.2,43,61,85,79,186.5,83.5,103.0
Q1 2024,30.6,7.8,22.8,13.7,9.1,8.8,3.00,10.8,4.6,3.6,1.3,2.96,1.92,10.22,65.0,660,1.1,76,3.3,42,60,84,78,182.0,81.0,101.0
Q4 2023,32.5,8.1,24.4,14.2,10.2,9.6,3.15,11.8,4.8,3.7,1.5,2.99,1.95,10.87,65.2,700,1.2,78,3.1,45,62,86,79,190.5,85.6,104.9
Q3 2023,30.8,7.9,22.9,13.9,9.0,8.9,2.89,10.9,4.7,3.6,1.4,2.96,1.92,10.42,64.9,680,1.1,77,3.2,43,61,85,78,185.4,82.1,103.3
Q2 2023,29.5,7.7,21.8,13.5,8.3,8.5,2.78,10.5,4.5,3.5,1.3,2.92,1.90,10.10,64.4,660,1.1,76,3.3,42,60,84,78,182.1,80.5,101.6
Q1 2023,27.3,7.5,19.8,12.8,7.0,7.9,2.65,9.8,4.2,3.2,1.2,2.89,1.88,9.44,64.0,640,1.0,75,3.5,41,59,83,77,175.0,78.2,96.8
Q4 2022,28.1,7.3,20.8,12.5,8.3,7.8,2.56,9.2,4.0,3.1,1.1,2.87,1.85,9.12,63.7,620,1.0,74,3.6,40,58,82,76,172.5,77.0,95.5
Q3 2022,27.5,7.0,20.5,12.2,8.3,7.5,2.50,8.9,3.8,3.0,1.0,2.85,1.82,8.96,63.4,600,0.9,73,3.7,39,57,81,75,168.9,75.0,93.9
Q2 2022,26.8,6.8,20.0,12.0,8.0,7.1,2.45,8.7,3.7,2.9,0.9,2.82,1.80,8.75,63.1,580,0.9,72,3.8,38,56,80,74,165.5,73.5,92.0
Q1 2022,25.6,6.6,19.0,11.7,7.3,6.8,2.30,8.3,3.5,2.7,0.8,2.80,1.78,8.55,62.9,560,0.8,71,3.9,37,55,79,73,160.0,71.0,89.0
Q4 2021,26.3,6.5,19.8,11.6,7.2,6.7,2.20,8.0,3.4,2.6,0.8,2.79,1.75,8.40,62.5,540,0.8,70,4.0,36,54,78,72,155.0,69.5,85.5
Q3 2021,25.9,6.4,19.5,11.5,7.1,6.6,2.15,7.8,3.3,2.5,0.7,2.77,1.72,8.30,62.0,520,0.7,69,4.1,35,53,77,71,150.8,68.0,82.8
Q2 2021,25.0,6.2,18.8,11.0,7.0,6.3,2.10,7.5,3.1,2.4,0.7,2.75,1.70,8.12,61.5,500,0.7,68,4.2,34,52,76,70,145.2,65.0,80.2
Q1 2021,23.8,6.0,17.8,10.5,6.7,5.9,2.00,7.0,3.0,2.2,0.6,2.73,1.68,7.95,61.0,480,0.7,67,4.3,33,51,75,69,140.5,63.5,77.0
Q4 2020,23.5,5.8,17.7,10.0,6.5,5.6,1.90,6.8,2.9,2.1,0.6,2.70,1.65,7.85,60.5,460,0.6,66,4.4,32,50,74,68,135.0,61.0,74.0
Q3 2020,22.8,5.5,17.3,9.8,6.3,5.3,1.80,6.5,2.8,2.0,0.6,2.68,1.62,7.75,60.0,440,0.6,65,4.5,31,49,73,67,130.8,59.5,71.3
Q2 2020,22.0,5.4,16.6,9.5,6.1,5.1,1.75,6.3,2.7,1.9,0.5,2.66,1.60,7.60,59.5,420,0.5,64,4.6,30,48,72,66,125.5,58.0,67.5
Q1 2020,21.5,5.3,16.2,9.2,6.0,4.8,1.70,6.0,2.5,1.8,0.5,2.65,1.58,7.50,59.0,400,0.5,63,4.7,29,47,71,65,120.0,56.0,64.0
`;

export const sampleReport = `
# Swerve Investor Report - Q3 2024 🚀

Dear Esteemed Shareholders,

It is with great pleasure and excitement that I present to you the extraordinary progress and achievements of Swerve during the third quarter of 2024. This period has been filled with significant milestones and exponential growth, highlighting our commitment to innovation, excellence, and creating a lasting impact in the digital media industry. Your steadfast support and belief in our vision have been instrumental in driving our success.

## Period Overview
**Third Quarter of 2024 (July 1 - September 30)**

Swerve has continued its upward trajectory in Q3 2024, building on the foundation laid by our dedicated team and groundbreaking solutions. The quarter was marked by strategic advancements, pivotal partnerships, and a relentless drive to redefine the landscape of media digitization.

## Key Highlights of the Quarter

| Highlight                                  | Description                                                                                       |
|--------------------------------------------|---------------------------------------------------------------------------------------------------|
| **📈 25% Increase in MRR**                 | MRR increased by 25%, reaching $150,000, highlighting the growing demand for our services.         |
| **🤝 Successful Onboarding of Two Clients**| Two major clients onboarded, expanding our enterprise footprint.                                   |
| **🌟 Strategic Partnership**               | A new collaboration with a leading industry player to drive innovation and enhance market presence.|

## Challenges Faced (Lowlights)

| Challenge                                  | Description                                                                                       |
|--------------------------------------------|---------------------------------------------------------------------------------------------------|
| **🛑 Product Development Delays**          | Technical hurdles delayed the release of advanced features, but adjustments have been made.         |
| **📉 Higher-than-Expected Churn**          | August saw an unexpected rise in customer churn, which led to immediate enhancements in retention.  |

## Key Performance Indicators (KPIs)

| KPI                                       | Q3 2024 Value       | Change from Q2 2024 |
|-------------------------------------------|---------------------|---------------------|
| **💰 Monthly Recurring Revenue (MRR)**     | $150,000             | +25%                |
| **💸 Customer Acquisition Cost (CAC)**     | $450 per customer    | Steady              |

## Team Contributions

| Team                                     | Contribution                                                                                     |
|------------------------------------------|--------------------------------------------------------------------------------------------------|
| **🏆 Product Team**                      | Successful beta launch, setting the stage for a full product launch in Q4.                        |
| **💼 Sales Team**                        | Secured key enterprise clients, boosting revenue and expanding market presence.                   |

## Fundraising Update
We are actively in discussions for our **Series B round**, targeting **$10 million** to accelerate product development and marketing initiatives. The funding will be pivotal in scaling our platform and ensuring that we capitalize on the growing opportunities in the digital media landscape.

## Product Launches

| Launch Event                              | Description                                                                                     |
|-------------------------------------------|-------------------------------------------------------------------------------------------------|
| **🚀 Beta Version Launch (August 2024)**   | Positive reception from users, laying the groundwork for the full release in Q4.                 |
| **🎯 New Analytics Feature**               | In development—this feature will provide users with key insights into media digitization trends. |

## Team Asks

| Ask                                       | Description                                                                                      |
|-------------------------------------------|--------------------------------------------------------------------------------------------------|
| **🤝 Healthcare Partner Introductions**    | Expanding our network in the healthcare industry to drive new collaborations.                     |
| **🧠 Customer Retention Guidance**         | Insights and expertise on improving our customer retention strategies.                            |

---

In closing, I extend my deepest gratitude for your unwavering support, passion, and belief in Swerve’s vision. Together, we are reshaping the digital media landscape and paving the way for a future where innovation knows no bounds.

With gratitude and optimism,
**Jude Daniels**
Founder & CEO, Swerve
`;
