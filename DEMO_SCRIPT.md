# 🎬 FixItFlow — 5-7 Minute Video Demonstration Script

> **Hackathon Submission Video Guide:** "CALL-E: Your Code Is Calling" Hackathon  
> **Target Duration:** 5 to 7 Minutes  
> **Speaker Role:** Presenter / Developer  

---

## ⏱️ Video Timeline Summary

| Time | Scene / Feature | On-Screen Action | Voiceover Focus |
|------|-----------------|------------------|-----------------|
| **0:00 - 1:00** | **Hook & Problem Statement** | Title Card & Pain Point Graphic | Property maintenance phone tag (45 min/ticket) |
| **1:00 - 2:00** | **Dashboard & Tenant Portal (`/submit`)** | Live App & `/submit` Form | Mobile tenant ticket submission |
| **2:00 - 3:30** | **AI Triage & Multi-Language Calling** | Trigger Dispatch & Call Timeline | CALL-E voice triage & Spanish/French voice calling |
| **3:30 - 4:30** | **Scoring Engine & Calendar Sync** | Quote Matrix & ICS Download | Smart contractor scoring & Google Calendar sync |
| **4:30 - 5:45** | **Batch Dispatch Engine** | Click "🚀 Dispatch All Tickets" | Concurrently handling 10+ tickets with rate limits |
| **5:45 - 6:30** | **CALL-E Code Architecture & Wrap** | Code Snippets (`plan_call`, `run_call`) | CALL-E MCP integration & concluding elevator pitch |

---

## 📜 Complete Minute-by-Minute Script

### 🎬 Segment 1: The Hook & The Problem (0:00 – 1:00)

**[Visual: Presenter on camera or FixItFlow Devpost Banner, transitioning to a split screen showing traditional property management phone chaos.]**

**🎤 Voiceover:**
> *"Hi everyone! Welcome to **FixItFlow** — an autonomous telephony dispatch engine built for the CALL-E hackathon: 'Your Code Is Calling'.*
>
> *If you've ever managed a rental property or lived in an apartment building, you know property maintenance is broken. A tenant reports a leaking pipe at 2 AM. The property manager wakes up, calls the tenant to diagnose the issue, then calls 3 to 5 local plumbers to check who's available today and compare quotes. Then they call the tenant back to schedule.*
>
> *That’s an average of **45 minutes of phone calls across 5 separate conversations for a single repair**. Why? Because local plumbers, electricians, and HVAC techs don’t have APIs or booking websites. They answer the phone, or they don't.*
>
> ***FixItFlow changes that by giving AI agents the ability to pick up the phone and execute the entire multi-party workflow autonomously.***"

---

### 🎬 Segment 2: Tenant Portal & Ticket Submission (1:00 – 2:00)

**[Visual: Screen recording opens on `http://localhost:3000/submit` — the sleek, mobile-first Tenant Portal.]**

**🎤 Voiceover:**
> *"Let's see it in action. Here is the FixItFlow Tenant Portal. Any tenant can report an emergency repair right from their phone without downloading an app.*
>
> *Let's fill out a live request: Sarah Jenkins at 742 Evergreen Terrace reports a 'Burst Pipe Under Kitchen Sink'. She marks the priority as **EMERGENCY** and clicks Submit.*
>
> *Immediately, the portal confirms receipt and tells Sarah: 'Our CALL-E AI Voice Agent will call your phone within 2 minutes to confirm details.'"*

---

### 🎬 Segment 3: AI Triage & Multi-Language Contractor Calling (2:00 – 3:30)

**[Visual: Switch to the Property Manager Dashboard at `http://localhost:3000`. Show the new ticket appearing. Click 'Trigger AI Call Dispatch'.]**

**🎤 Voiceover:**
> *"Now we switch over to the Property Manager Dashboard. The ticket has appeared in real time. Watch what happens when I click **Trigger AI Call Dispatch**.*
>
> *FixItFlow initiates **Phase 1: AI Triage Call**. Using CALL-E's `plan_call` and `run_call`, the AI agent dials Sarah. It asks diagnostic questions: 'Is water actively pooling?', 'Have you located the shutoff valve?' The AI extracts structured JSON parameters — severity is marked CRITICAL, and access instructions are saved.*
>
> *Next, FixItFlow moves to **Phase 2: Multi-Contractor Sourcing**. Here is where CALL-E shines.*
>
> *Our contractor registry includes tradespeople with different preferred languages. For example, Carlos Martinez speaks Spanish. FixItFlow reads Carlos's language preference and instructs CALL-E to conduct the call in **Spanish**.*
>
> *And if a contractor is out on a job and misses the call? FixItFlow automatically triggers our **SMS Fallback Service**, sending an instant text alert with job details so no contractor is left out."*

---

### 🎬 Segment 4: Smart Scoring, Confirmation & Calendar Sync (3:30 – 4:30)

**[Visual: Open the Ticket Detail Modal. Show the Call Transcripts, audio waveform visualizer, and the selected contractor box.]**

**🎤 Voiceover:**
> *"Once quotes are collected, FixItFlow runs our **Smart Contractor Scoring Algorithm**. It evaluates rating, hourly pricing, availability, and emergency priority.*
>
> *Here, Apex Plumbing scored **92/100** — locking in a $150 quote for 2:00 PM today.*
>
> *FixItFlow then executes **Phase 3: Confirmation Call**, calling Sarah back to confirm 2:00 PM.*
>
> *Notice our **Calendar Integration Widget** on the dashboard! The appointment automatically syncs with Google Calendar, and property managers or tenants can click **Download ICS** to import the event into Outlook or Apple Calendar."*

---

### 🎬 Segment 5: Batch Dispatch Engine ("Dispatch All 10+ Tickets") (4:30 – 5:45)

**[Visual: Point to the Batch Dispatch Panel at the top of the dashboard showing '3 Open Tickets Waiting'.]**

**🎤 Voiceover:**
> *"Now, what if a property manager is handling 50 units with dozens of open tickets? Dispatching one-by-one is tedious.*
>
> *That’s why we built the **Batch Dispatch Engine**. Right here on top of the dashboard, you see the 'Batch Dispatch Engine' panel.*
>
> *Watch as I click **🚀 Dispatch All 3 Tickets**. FixItFlow spins up parallel execution workers with intelligent rate-limiting. In seconds, all open tickets transition through triage, sourcing, and confirmation concurrently — updating the dashboard live with success indicators."*

---

### 🎬 Segment 6: Code Architecture & Conclusion (5:45 – 6:30)

**[Visual: Show VS Code code snippets of `src/lib/calle.ts` and `src/lib/dispatch-engine.ts`. Return to Presenter / Devpost Cover Graphic.]**

**🎤 Voiceover:**
> *"Under the hood, FixItFlow is built on **Next.js 16 App Router**, **Prisma 7 ORM**, and the official **CALL-E CLI and MCP tools**.*
>
> *Here in `dispatch-engine.ts`, you can see how we chain `calle.planCall()`, `calle.runCall()`, and `calle.getCallRun()` into a deterministic state machine.*
>
> *CALL-E proves that AI agents don't have to stop at generating text — they can pick up the phone, adapt in real-time, and get real-world work done.*
>
> *FixItFlow is fully open-source on GitHub at `rohanjain1648/FixItFlow`. Your code is calling. Time to answer.*
>
> *Thank you!"*

---

## 🛠️ Recording Tips for Demo Success

1. **Screen Resolution:** Record at 1920x1080 (1080p) at 60fps.
2. **Audio Quality:** Use a clean USB microphone or headset; ensure low background noise.
3. **Browser Zoom:** Set browser zoom to 110% so dashboard badges and text are crisp on video.
4. **Playback Speed:** Maintain an energetic, confident speaking tone (~135 words per minute).
