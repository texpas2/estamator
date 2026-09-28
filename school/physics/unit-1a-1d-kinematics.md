# Physics: Unit 1A, 1D Kinematics (Chapter 3)

Sources:
- `sources/Kinematics-Notes-1A-KEY.pdf`: teacher's answer key for Notes 1A.1 (Academic Physics, 10 pages)
- `sources/2026-09-23-whiteboard-which-equation-flowchart.jpg`: whiteboard photo from 9/23 of the "Which equation?" flowchart

Teacher: Kosinski (the board is labeled "KOSINS…").

---

## 1. Vocabulary

| Term | Symbol | Meaning | Type |
|---|---|---|---|
| Initial position | xᵢ | Where the motion starts | vector |
| Final position | x_f | Where the motion ends | vector |
| Distance | d | How far you traveled in total | scalar |
| Displacement | Δx = x_f − xᵢ | Change in position, which includes direction | vector |
| Time interval | t | How long the motion took | scalar |
| Speed | s = d / t | The rate at which distance is covered | scalar |
| Velocity | v = Δx / t | The rate at which displacement happens | vector |
| Acceleration | a = Δv / t | The rate at which velocity changes | vector |

- **"Rate"** in this class always means *something divided by time*.
- **Vector**: has a magnitude and a direction (+ or −). **Scalar**: has a magnitude only.
- **Sign convention**: + means right and − means left. The final answer doesn't depend on which way you choose as positive.
- Quantities that can be negative include position, temperature, velocity and displacement.
- Units: m, s, m/s. Convert cm → m by dividing by 100.

## 2. Distance vs. displacement (ant examples)

| Ex | Path | Displacement | Distance |
|---|---|---|---|
| 1 | 1 cm → 5 cm | +4 cm | 4 cm |
| 2 | 6 cm → 4 cm | −2 cm | 2 cm |
| 3 | 4 → 6 → 5 cm | +1 cm | 3 cm |

- In Ex 1 the trip takes 2 s: speed = 2 cm/s = 0.02 m/s, and velocity = 0.02 m/s to the right. **The numbers are the same, but these are different quantities** because speed is a scalar and velocity is a vector.
- In Ex 3 the trip takes 10 s: speed = 3/10 = 0.3 cm/s, and velocity = 1/10 = 0.1 cm/s to the right.
- "I start at EBHS and travel 100 miles. Where am I?" The answer could be anywhere on a 100-mile circle, which is why direction matters.

## 3. Average vs. instantaneous velocity

- **Average velocity** = total displacement ÷ total time.
- **Instantaneous velocity** = the average velocity over a very small time interval, i.e. the velocity at one instant. On an x–t graph, it is the **slope** at that point.
- Trip example: you drive 60 mph for 1 h, rest ½ h, then drive 60 mph for ½ h to cover 90 mi. The average velocity is 90/2 = **45 mph**, even though you never actually drove at 45 mph.
- An average velocity question has one answer only after you **specify the time interval**.

## 4. Graphs

**Position vs. time (x–t)**
- slope = velocity
- A horizontal line means the object is stopped (v = 0).
- A straight sloped line means constant velocity.
- Boat-in-canal example: 3 plateaus mean 3 stops. The average is (100 − 0) km / 10 h = 10 km/h. The top speed is (40 − 20)/(3 − 2) = 20 km/h.

**Converting x–t → v–t:** take the slope of each segment and draw it as a horizontal segment on the v–t graph.
- Example: slope 30 m/s from 0–1 s, 0 from 1–2 s, then (40 − 30)/(4 − 2) = 5 m/s from 2–4 s.

**Velocity vs. time (v–t)**
- **area under the curve = displacement**. Area above the axis is + and area below the axis is −.
- Example: 20 m/s for 2 s gives +40 m; 0 for 1 s gives 0 m; −10 m/s for 1 s gives −10 m.
- Do Now: 10 m/s × 5 s gives +50 m, and −10 m/s × 5 s gives −50 m.

## 5. "Where do they meet?" (systems of equations)

For constant velocity, the position equation is a straight line (y = b + mx):

**x_f = xᵢ + v·t**

Method: write one equation for each object, set them equal, solve for t, then plug t back in to get x_f.
(For n unknowns you need n independent equations.)

| Problem | Equations | Meet time | Meet position |
|---|---|---|---|
| Graph A vs B | A: −150 + 10t, B: 0 + 3.75t | t = 24 s | x = 90 m (reading the graph gives about 22.5 s, 75 m) |
| Kevin & David (trail) | K: 0 + 2t, D: 4.5 − 5t | 7t = 4.5 → t ≈ 0.64 h (key: 0.6 h) | ≈ 1.29 mi (key: 1.2 mi) |
| Lion & gazelle | L: 0 + 50t, G: 0.5 + 30t | 20t = 0.5 → **t = 0.025 h** (1.5 min) | **1.25 mi** from the lion's start |

⚠️ **Key rounding note:** the key rounds early. For the lion it uses t ≈ 0.03 h, which gives 1.5 mi, but the exact values are 0.025 h and 1.25 mi. For Kevin & David it uses 0.6 h and 1.2 mi, but the exact values are 0.643 h and 1.29 mi. Keep full precision until the last step.

Note on signs: an object moving left (toward x = 0) gets a **negative** velocity, as David's −5 mph does.

## 6. "Which equation?" flowchart (whiteboard, 9/23)

```
Do I care? ── No → OK.
   │ yes
What kind of motion is it?
 ├─ Constant v  →  v = Δx / t
 ├─ Both (part constant v, part constant a) → break it into segments, then run each one through this chart
 └─ Constant a
      Do I care about Δx?
       ├─ No  →  a = Δv / t          (i.e. v_f = vᵢ + a·t)
       └─ Yes → Do I care about time?
                 ├─ Yes → Δx = vᵢ·t + ½·a·t²
                 └─ No  → v_f² = vᵢ² + 2·a·Δx
```

How to use it: list the knowns and the unknown, figure out the type of motion, then pick the equation that **leaves out** the variable you don't have and don't need.

## Quick self-check

1. Is speed a vector? *(No, it's a scalar.)*
2. What does the slope of an x–t graph give you? What does the area under a v–t graph give you? *(Velocity; displacement.)*
3. A car starts at −20 m and moves at +4 m/s. Where is it after 5 s? *(x = −20 + 4·5 = 0 m.)*
4. A ball starts from rest with a = 3 m/s² and travels 24 m. What is its final speed? *(No time given → v_f² = 0 + 2·3·24 = 144 → 12 m/s.)*
