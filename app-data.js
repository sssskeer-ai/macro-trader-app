// Year 1 plan data: expanded from the markdown plan into 52 week objects.
const BLOCKS = [
  { quarter: 1, range: [1, 4], theme: "Arithmetic of Markets",
    math: "Algebra refresher: functions, exponents/logs (compounding & returns), basic graphing",
    python: "Variables, data types, loops, functions, lists/dicts. Get comfortable with Python + terminal.",
    macro: "What GDP, inflation, unemployment, and interest rates are, how they're measured, why they move markets",
    capstoneWeek: 4,
    capstone: "Write a Python script that calculates CAGR (compound annual growth rate) given a list of yearly returns.",
    assessment: "Explain in your own words: what raises inflation, what a central bank does when it 'hikes rates', and why log returns are used instead of simple returns." },
  { quarter: 1, range: [5, 8], theme: "Describing Data",
    math: "Descriptive statistics: mean, median, variance, standard deviation, normal distribution",
    python: "numpy and pandas basics: loading CSVs, dataframe operations",
    macro: "Business cycles: expansion/recession phases, leading vs lagging indicators",
    capstoneWeek: 8,
    capstone: "Download 5 years of S&P 500 daily prices (yfinance), compute daily returns, mean, and std dev with pandas.",
    assessment: "Quiz yourself on variance/std dev, then walk through your capstone code line by line out loud." },
  { quarter: 1, range: [9, 13], theme: "Probability + First Real Project",
    math: "Probability basics: distributions, expected value, correlation vs causation",
    python: "matplotlib/seaborn for visualization",
    macro: "Central banks and monetary policy: how the Fed/ECB actually move markets",
    capstoneWeek: 13,
    capstone: "Q1 CAPSTONE: pull 1 economic indicator (e.g. 10yr Treasury yield from FRED) + 1 market index, plot together over 10yrs, write 3 sentences interpreting the relationship.",
    assessment: "Present the capstone as if briefing a portfolio manager. Bring it to Claude Code for pushback questions." },
  { quarter: 2, range: [14, 17], theme: "Calculus Intuition",
    math: "Derivatives (rate of change) and integrals (accumulation) - intuition over proofs. Why this matters for risk/sensitivity (bond duration).",
    python: "Writing reusable functions/modules for your own analysis toolkit",
    macro: "Dalio's Principles for Navigating Big Debt Crises - Part 1: the template",
    capstoneWeek: 17,
    capstone: "Write a short explanation connecting bond duration to the derivative concept.",
    assessment: "Explain 'duration' of a bond in plain English using the derivative concept." },
  { quarter: 2, range: [18, 21], theme: "Regression & Relationships",
    math: "Correlation, simple linear regression, hypothesis testing basics (p-values, confidence intervals, and their limits)",
    python: "statsmodels or sklearn for simple regression on financial data",
    macro: "Big Debt Crises - Part 2: case studies",
    capstoneWeek: 21,
    capstone: "Regress a stock/sector's returns against an economic variable (e.g. interest rates), interpret R^2 and coefficient.",
    assessment: "Quiz: when is regression misleading? (spurious correlation, overfitting on small samples)" },
  { quarter: 2, range: [22, 26], theme: "Currencies & FX Mechanics",
    math: "Variance of portfolios, covariance",
    python: "Pull FX data, compute rolling correlations between currency pairs and rate differentials",
    macro: "How currencies are priced: interest rate differentials, purchasing power parity, capital flows",
    capstoneWeek: 26,
    capstone: "Q2 CAPSTONE: build a small 'economic dashboard' script - 3-4 indicators (yields, inflation, FX, equity index) auto-pulled and charted together.",
    assessment: "Walk through the dashboard and answer: if the Fed surprises with a rate hike tomorrow, what happens to each series and why?" },
  { quarter: 3, range: [27, 30], theme: "Linear Algebra Basics",
    math: "Vectors, matrices, matrix multiplication - intuition for portfolios as vectors and covariance matrices",
    python: "numpy matrix operations; compute a covariance matrix for a basket of assets",
    macro: "The yield curve: what it is, why inversions matter, how bond markets price growth/inflation expectations",
    capstoneWeek: 30,
    capstone: "Compute and visualize a covariance matrix for 4-5 assets.",
    assessment: "Explain why a covariance matrix matters for portfolio risk (concept only, no heavy math needed)." },
  { quarter: 3, range: [31, 35], theme: "Time Series Basics",
    math: "Stationarity, autocorrelation, why naive regression fails on trending time series",
    python: "Basic backtesting: turn your trading rules into a script that simulates historical performance",
    macro: "Global macro linkages: how a recession in one region transmits through trade/capital flows",
    capstoneWeek: 35,
    capstone: "Backtest your current trading strategy properly: Sharpe ratio, max drawdown, win rate - not just total return.",
    assessment: "Defend your backtest against questions on lookahead bias, overfitting, and survivorship bias." },
  { quarter: 3, range: [36, 39], theme: "Risk Parity Concepts (the Bridgewater core idea)",
    math: "Volatility-weighting, diversification math (why uncorrelated assets reduce risk more than returns suggest)",
    python: "Build a simple risk-parity allocation across 3-4 asset classes using historical volatility",
    macro: "Bridgewater's 'Economic Machine' framework and the All Weather portfolio concept",
    capstoneWeek: 39,
    capstone: "Q3 CAPSTONE: compare your risk-parity allocation's historical performance vs a simple 60/40 portfolio.",
    assessment: "Explain risk parity to a smart non-finance friend. Clarity of explanation is the test, not jargon." },
  { quarter: 4, range: [40, 43], theme: "Start CFA L1 + Writing Habit",
    math: "CFA L1 quant methods section",
    python: "Clean up your toolkit into one reusable repo (data pulling, analysis, backtesting)",
    macro: "CFA L1 economics section + write your FIRST public macro note (300-500 words, one chart you made)",
    capstoneWeek: 43,
    capstone: "Publish your first public macro note.",
    assessment: "Bring the note for review: argument structure, and whether the data actually supports the claim." },
  { quarter: 4, range: [44, 48], theme: "Weekly Public Notes Become Routine",
    math: "CFA L1 continued",
    python: "Add one new data source or analysis technique every 2 weeks",
    macro: "Publish one public macro note per week (blog/LinkedIn/Substack - public and timestamped)",
    capstoneWeek: 48,
    capstone: "Keep the weekly public note streak going.",
    assessment: "Every 2 weeks: review latest note + defend your view against a counterargument." },
  { quarter: 4, range: [49, 52], theme: "Year-End Capstone",
    math: "Review & consolidate",
    python: "Polish your full toolkit for the final report",
    macro: "Write a full macro research report (2-3 pages) on one theme, e.g. 'Is the yield curve signaling recession risk right now?'",
    capstoneWeek: 52,
    capstone: "FINAL CAPSTONE: 2-3 page macro research report with your own data analysis, 1+ chart, and a clear falsifiable forecast. Treat it as a mock pitch to a portfolio manager.",
    assessment: "Graded on: (1) data correctly sourced/analyzed, (2) logic of argument, (3) what would prove you wrong, (4) clarity of writing." },
];

function buildWeeks() {
  const weeks = [];
  for (const block of BLOCKS) {
    for (let w = block.range[0]; w <= block.range[1]; w++) {
      const isCapstone = w === block.capstoneWeek;
      weeks.push({
        week: w,
        quarter: block.quarter,
        theme: block.theme,
        math: block.math,
        python: block.python,
        macro: block.macro,
        isCapstone,
        saturday: isCapstone
          ? { label: "MAJOR ASSESSMENT / CAPSTONE", task: block.capstone, quiz: block.assessment }
          : { label: "Weekly Assessment", task: "Quick self-quiz + mini practice on this week's Math/Python/Macro topics.", quiz: block.assessment },
      });
    }
  }
  return weeks;
}

const WEEKS = buildWeeks();

const DAY_TASKS = {
  Monday: w => ({ title: "Math + Python", items: [`Math: ${w.math}`, `Python: ${w.python}`] }),
  Tuesday: w => ({ title: "Math + Python", items: [`Math: ${w.math}`, `Python: ${w.python}`] }),
  Wednesday: w => ({ title: "Macro + Python applied", items: [`Macro: ${w.macro}`, `Python: apply today's coding skill to real data`] }),
  Thursday: w => ({ title: "Math + Python", items: [`Math: ${w.math}`, `Python: ${w.python}`] }),
  Friday: w => ({ title: "Macro + Journal review", items: [`Macro: ${w.macro}`, `Review your own trading journal/system against this week's concept`] }),
  Saturday: w => ({ title: w.saturday.label, items: [w.saturday.task, `Self-quiz: ${w.saturday.quiz}`, "Bring your answers/code to Claude Code for review."] }),
  Sunday: () => ({ title: "Rest", items: ["Rest day - optional light reading only."] }),
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
