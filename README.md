# ⚽ Messi Goal Tracker — Natural Language AI Companion

An intelligent natural language interface for my **Messi Goal Tracker Looker Studio Dashboard** 

Dashboard:
https://datastudio.google.com/reporting/9d51c83b-11ea-44eb-b4dd-20a8ca54fd8a/page/JS6uB

Blog-post:
https://worktimesheet2014.blogspot.com/2021/01/messi-goal-tracker-dashboard-in-google.html

Instead of manually navigating Looker Studio, opening complex filter menus, and selecting dropdown items, users can simply ask questions in plain, everyday language to dynamically view pre-filtered dashboard results.

---

<img width="859" height="1164" alt="image" src="https://github.com/user-attachments/assets/09a94847-86ec-4666-ac12-bc69e2330f44" />


## 🌟 Key Features

* **Natural Language Queries:** Type queries naturally (e.g., *"Show me all Messi goals for Argentina"* or *"Messi goals against FC Ajax"*).
* **Automatic Dimension Extraction:** Extracts precise dimensions tailored to the underlying dataset:
  * **Team:** *e.g., Argentina, FC Barcelona, Paris Saint-Germain, Inter Miami*
  * **Competition:** *e.g., UEFA Champions League, La Liga, World Cup, Copa América*
  * **Opponent:** *e.g., Real Madrid, Netherlands, Ajax, Sevilla*
* **Smart Filter Boundary Handling:** Strictly extracts only specified parameters. Querying *"Messi goals in the Champions League"* leaves the team filter open so all Champions League goals across all clubs are accurately reflected.
* **Precise Looker Studio URL Encoding:** Automatically maps extracted entities to Looker Studio URL parameters (`df5` for Competition, `df6` for Team, and `df8`/`df9` for Opponent), taking into account specific delimiter encodings and dataset spacing.
* **One-Click Live View:** Generates an **"Open in Looker Studio"** direct link that opens the live dashboard pre-filtered to the exact dimensions requested.
* **Interactive Dashboard & Query History:** Allows immediate embedded viewing and query re-execution on the spot.

---

## 🤖 How the AI Works

Think of this application as an intelligent, context-aware translator between a human football fan and a rigid computer dashboard.

### 1. The Challenge: Rigid Dashboards vs. Flexible Humans
Dashboards require exact matches. If a dropdown expects `" UEFA Champions League"` and a user inputs `"champions league"`, the query fails. Dashboards cannot infer that *"Barca"* means *"FC Barcelona"* or handle typos like `"shjow me"`.

### 2. How the AI Bridges the Gap
* **Semantic Understanding:** Interprets phrases contextualized by intent rather than basic keyword matching.
  > Example: *"Messi goals for Barca in La Liga against Real Madrid"*
  > * **"for Barca"** $\rightarrow$ Team (`FC Barcelona`)
  > * **"in La Liga"** $\rightarrow$ Competition (`La Liga`)
  > * **"against Real Madrid"** $\rightarrow$ Opponent (`Real Madrid`)
* **Alias & Typo Resolution:** Automatically translates shorthand, slang, and common nicknames:
  * `"Barca"` / `"FCB"` $\rightarrow$ `FC Barcelona`
  * `"Champions League"` / `"UCL"` $\rightarrow$ `UEFA Champions League`
  * `"FC Ajax"` / `"against (oponent) 'FC Ajax'"` $\rightarrow$ `Ajax`
* **Zero-Assumption Filtering:** Prevents over-filtering by leaving non-mentioned dimensions unselected.

### 3. Execution & Link Generation
Once clean dimension values (`FC Barcelona`, `UEFA Champions League`, `Real Madrid`) are extracted, the URL engine converts them into Looker Studio bookmark parameters to load the target view instantly.

---

## 🛠️ Usage Examples

| Input Query | Extracted Filters | Generated Parameters |
| :--- | :--- | :--- |
| `"Show me all Messi goals for Argentina"` | Team: `Argentina` | `df6=Argentina` |
| `"Messi goals for Barca in Champions League against Real Madrid"` | Team: `FC Barcelona`<br>Competition: `UEFA Champions League`<br>Opponent: `Real Madrid` | `df6=FC Barcelona`<br>`df5=UEFA Champions League`<br>`df8/df9=Real Madrid` |
| `"Messi goals in the World Cup"` | Competition: `World Cup` | `df5=World Cup` |

---

## 💡 About This Repository

This project is part of a series of AI experiments focused on bridging human intent with structured analytics tools and web dashboards using Natural Language Processing (NLP) and LLM entity extraction.
