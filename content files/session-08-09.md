# International Economics (MBA) — Sessions 8 & 9: Empirical Evidence and Alternate Trade Theories

**Course:** International Economics | **Instructor:** Prof. Kalyan Kolukuluri | **Institution:** IIM Visakhapatnam  
**Slide Deck:** PPT5INEAlternateTradeTheories (September 23, 2025)  
**Textbook Reference:** Salvatore, Chapter 6  
**Topics:** Intra-Industry Trade, Gravity Models, Porter's Competitive Advantage

---

## Learning Objectives

- Understand alternative theories to explain **trade patterns** that classical theories cannot explain
- Understand the concept and measurement of **Intra-Industry Trade (IIT)**
- Understand the **Gravity Model** of trade
- Understand **Porter's Competitive Advantage of Nations** framework

---

## 1. Why Alternate Theories? — The Paradox in International Trade

### 1.1 What Classical Theory Predicted

Classical and H-O theory predicted:
- Countries export goods in which they have **factor abundance**
- Rich (capital-abundant) countries trade with poor (labour-abundant) countries
- Trade is **inter-industry** (Germany exports machines and imports textiles)

### 1.2 The Leontief Paradox

> **Leontief Paradox (1953):** **Wasily Leontief**, a Russian-American Harvard economist, observed that the **USA exported labour-intensive goods and imported capital-intensive goods** — the opposite of what H-O theory predicted for the world's most capital-abundant country.

**Additional observation:** Industrialised rich countries traded **very similar products** with each other (Germany exports BMW and imports Mercedes? No — Germany exports BMWs and imports Volkswagen Tiguans from Czech Republic). This is **intra-industry trade**, which H-O cannot explain.

---

## 2. The Full Taxonomy of Trade Theories

```
BASIS FOR TRADE
│
├── Absolute Advantage (Adam Smith)
├── Comparative Advantage (David Ricardo)
├── Factor Abundance (Heckscher-Ohlin)
├── Increasing Returns (Economies of Scale)  ← Sessions 8-9 focus
├── External Economies                        ←
└── Dynamic Technology Change                 ←
```

---

## 3. Intra-Industry Trade (IIT)

### 3.1 What is IIT?

**Intra-Industry Trade** occurs when a country **both exports and imports** goods from the **same industry** simultaneously.

```
INTRA-INDUSTRY TRADE
        │
        ├── Economies of Scale
        │      ├── International
        │      └── Domestic
        └── Outsourcing / Offshoring
```

**Why does IIT exist?**
- **Economies of scale:** No single country can produce every variety efficiently
- **Product differentiation:** Consumers value variety — they want Korean Hyundai and German BMW
- **Monopolistic competition:** Each firm produces a unique differentiated product

### 3.2 Measuring IIT — The Grubel-Lloyd (GL) Index

> **Grubel-Lloyd Index:** A metric of the intra-industry trade share in a given industry.

```
GL Index = 1 − |X_i − M_i| / (X_i + M_i)
```

Where:
- **X_i** = Exports of a country in industry *i*
- **M_i** = Imports of a country in industry *i*

**Interpretation:**
- **GL Index = 1** → All trade in that industry is intra-industry (equal exports and imports)
- **GL Index = 0** → All trade is inter-industry (only exports OR only imports)

**Example:** If India exports $100M of auto parts and imports $80M of auto parts from the same industry:
```
GL = 1 − |100 − 80| / (100 + 80) = 1 − 20/180 = 1 − 0.11 = 0.89 → High IIT
```

### 3.3 Measuring Product Specialisation — Michaely Index

```
Y_ij = (X_ij / Σ_i X_ij) − (M_ij / Σ_i M_ij)
```

Where:
- Calculated for one industry *i* (e.g., automobile manufacturing) relative to one trading partner *j* (e.g., USA)
- **Small (more negative) value** → no specialisation
- **High value** → strong specialisation

### 3.4 Why IIT Happens — Monopolistic Competition

**The model:**
- Many firms produce **differentiated products** in the same industry
- Each firm faces a downward-sloping demand curve (some market power due to product differentiation)
- Entry and exit are free → long-run normal profits
- Firms exploit **economies of scale** by focusing on one variety for the world market

```
Pre-Trade:               Post-Trade:
Many small firms         Fewer, larger firms
Serving domestic market  Each specialising in one variety
                        for the global market
Higher average cost      Lower average cost (scale economies)
Less variety             More variety (through imports)
```

**Consumer gain from IIT:** Access to more variety at lower prices (due to scale economies in production).

### 3.5 Horizontal vs Vertical IIT

| | **Horizontal IIT** | **Vertical IIT** |
|---|---|---|
| **Definition** | Products differ in **attributes** but NOT in quality or price | Products differ in **quality or price** |
| **Production** | Same factors and production techniques | Different factors and production techniques |
| **Example** | UK exports Land Rover & imports Volkswagen Tiguan | Small cars (Maruti 800) vs Luxury cars (Bentley) |
| **Another example** | Italy exports Ferrari & imports Aston Martin | Japanese compact export vs European sedan import |

### 3.6 Measuring H-IIT vs V-IIT

```
1 − α  ≤  (UV_export / UV_import)  ≤  α
```

Where:
- **α** = dispersion factor
- **α ≤ 15** (i.e., UV ratio within 15% band) → indicates **Horizontal IIT (HIIT)**
- **UV_export** = Value of exports / Units of exports (unit value)
- **UV_import** = Value of imports / Units of imports

> **Why does this matter?** Rising Vertical IIT (VIIT) may indicate **technological improvement** in an economy — the country is climbing the quality ladder in its exports.

---

## 4. Gravity Model of Trade

### 4.1 The Newton Analogy

**Jan Tinbergen (Dutch economist, Nobel laureate)** adapted Newton's law of gravity to explain trade flows between countries.

> Newton's Law: **F = G × (M1 × M2) / D²** (gravitational force between two masses)

Tinbergen's Trade Gravity:

```
T_ij = A × (Y_i × Y_j) / D_ij
```

Where:
- **T_ij** = Total trade flow from country *i* to country *j*
- **Y_i, Y_j** = Economic size of countries *i* and *j* (usually GDP or GNP)
- **D_ij** = Distance between countries *i* and *j* (proxy for transport costs)
- **A** = Constant term capturing other factors

### 4.2 Interpretation of Each Component

| Variable | What it Captures | Logic |
|---|---|---|
| **Y_i × Y_j** (GDP product) | Market size of both countries | Larger economies trade more — more to buy and sell |
| **D_ij** (Distance) | Transport costs, cultural distance, information costs | More distant countries trade less |
| **A** (Constant) | Language, colonial ties, trade agreements, etc. | Shared language/history boosts trade |

### 4.3 Real-World Validation

> **"Indeed, US and China are major trading partners"** — consistent with Gravity Model (both large economies despite political tensions)

**Empirical finding:** Distance matters enormously. Trade between neighbouring countries is typically 5-10x higher than with distant countries of similar size. Canada and Mexico account for ~30% of US trade despite having smaller GDPs than the EU.

### 4.4 Extended Gravity Model Factors

Modern empirical versions include:
- Common language (boosts trade by ~45%)
- Colonial ties (boosts trade significantly)
- Common border (major trade booster)
- Trade agreements (WTO, FTAs)
- Cultural distance (social, religious, political similarity)

---

## 5. Porter's Competitive Advantage of Nations (The Diamond Model)

### 5.1 Framing — Why "Competitive" Not "Comparative"?

> **"Note: The key word is *competitive*, not *comparative*."** — Prof. Kolukuluri

Porter's framework operates at the **firm and industry level** rather than the country level. It asks: why do firms in certain nations succeed internationally in specific industries?

> **"A nation's competitiveness depends on the capacity of its industry to innovate and upgrade."**  
> **"Companies benefit from having strong domestic rivals, aggressive home-based suppliers, and demanding local customers."**  
> — Michael Porter, *The Competitive Advantage of Nations*, 1990

### 5.2 Porter's Diamond Framework

```
            ┌─────────────────────────────┐
            │    FIRM STRATEGY,           │
            │    STRUCTURE &              │
            │    RIVALRY                  │
            └──────────┬──────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              NATIONAL ADVANTAGE                  │
└───┬─────────────────────────────────────────┬───┘
    │                                         │
┌───▼────────────────┐    ┌───────────────────▼───┐
│  FACTOR CONDITIONS │    │  DEMAND CONDITIONS    │
│                    │    │                       │
│ • Labour           │    │ • Size of home market │
│ • Capital          │    │ • Sophistication of   │
│ • Infrastructure   │    │   domestic buyers     │
│ • Knowledge        │    │ • Anticipatory demand │
└────────────────────┘    └───────────────────────┘
            │                         │
    ┌───────▼─────────────────────────▼───────┐
    │     RELATED AND SUPPORTING               │
    │     INDUSTRIES                           │
    │                                          │
    │ • Presence of competitive suppliers      │
    │ • Related industries with world-class    │
    │   firms                                  │
    └──────────────────────────────────────────┘
```

### 5.3 The Four Determinants of National Competitive Advantage

| Determinant | Description | Indian Example |
|---|---|---|
| **Factor Conditions** | Nation's endowment of production factors — not just inherited (like raw materials) but also created (skilled labour, infrastructure, research) | Large pool of English-speaking IT engineers |
| **Demand Conditions** | Nature of **home market demand** — sophisticated, demanding local customers push firms to innovate | Large domestic mobile market drove Jio's 4G innovation |
| **Related and Supporting Industries** | Presence of competitive **supplier and related industries** | Bollywood + post-production + music = Indian entertainment cluster |
| **Firm Strategy, Structure, and Rivalry** | Conditions governing creation, organisation, and management of companies + **domestic competition** | Intense competition among Indian pharma companies → world-class generics export |

### 5.4 Two Additional Variables (Government and Chance)

Porter also notes two external variables that can influence the diamond:
- **Government:** Can positively (or negatively) affect all four determinants through policy
- **Chance:** Random events (wars, discoveries, shifts in demand) can disrupt or create competitive advantage

---

## 6. Comparing the Three Alternate Theories

| Theory | Author | Explains | Does NOT explain |
|---|---|---|---|
| **IIT (Economies of Scale)** | Krugman, Helpman, Grubel-Lloyd | Why rich countries trade similar goods with each other | N-S trade (developing-developed) |
| **Gravity Model** | Tinbergen | Why trade intensity depends on size and distance | Industry-specific patterns |
| **Porter's Diamond** | Michael Porter | Why certain countries dominate specific industries | Distribution of gains from trade |

---

## 7. The Leontief Paradox Revisited — Proposed Resolutions

Since Leontief's finding contradicted H-O, economists proposed several explanations:

1. **Human capital:** US exports are intensive in *skilled labour* (human capital), not just physical capital — consistent with US abundance in human capital
2. **Technology gap:** US exports technologically advanced goods — these require skilled labour, not just capital
3. **Natural resources:** US imports are resource-intensive (oil, steel), which happens to also be capital-intensive
4. **Demand reversal:** Even if the US is capital-abundant, if US consumers demand relatively more capital-intensive goods, the US might import them
5. **Factor intensity reversal:** Some goods switch from being capital-intensive to labour-intensive at different relative factor prices

---

## 8. Exam-Ready Summary

### Key Formulas

| Index | Formula | What it Measures |
|---|---|---|
| **GL Index** | `1 − |X_i − M_i| / (X_i + M_i)` | Share of intra-industry trade (0 to 1) |
| **Michaely Index** | `Y_ij = (X_ij / Σ X_ij) − (M_ij / Σ M_ij)` | Degree of product specialisation |
| **Gravity Model** | `T_ij = A × Y_i × Y_j / D_ij` | Predicted bilateral trade volume |
| **HIIT Test** | `1−α ≤ UV_x/UV_m ≤ α` | Horizontal vs Vertical IIT distinction |

### Key Concepts to Define

- **Intra-Industry Trade:** Simultaneous export and import of goods in the same product category
- **Grubel-Lloyd Index:** Measures the share of IIT; ranges 0 (pure inter-industry) to 1 (pure intra-industry)
- **Gravity Model:** Trade flows proportional to economic size of partners, inversely proportional to distance
- **Horizontal IIT:** Trade in differentiated goods of similar quality (Ferrari vs Aston Martin)
- **Vertical IIT:** Trade in goods of different quality (Maruti 800 vs Bentley); rising VIIT signals technological upgrading
- **Porter's Diamond:** Four-factor model explaining why nations achieve international competitive advantage in specific industries

---

## 9. Discussion Questions

1. What is the Leontief Paradox and why does it challenge the Heckscher-Ohlin model?
2. Define intra-industry trade. How does monopolistic competition explain IIT?
3. Calculate the Grubel-Lloyd index for an industry where a country exports $200M and imports $50M. What does this tell you about the trade pattern?
4. What is the difference between Horizontal IIT and Vertical IIT? Give your own examples.
5. Explain the Gravity Model. What does it predict about trade between India and Sri Lanka vs India and Brazil?
6. Why does rising Vertical IIT indicate technological improvement?
7. What are Porter's four determinants of national competitive advantage? Apply the Diamond to explain India's software industry competitiveness.
8. How is competitive advantage different from comparative advantage? Why does Porter say the word "competitive" matters?
