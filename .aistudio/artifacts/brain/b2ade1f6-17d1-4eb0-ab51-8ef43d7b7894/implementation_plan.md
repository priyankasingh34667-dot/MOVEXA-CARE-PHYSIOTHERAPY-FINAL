# MOVEXA Care — Clinical Physiotherapy Management Web App

MOVEXA Care is a digital patient management, clinical documentation, and rehabilitation platform built for MOVEXA Physiotherapy under the clinical leadership of **Dr. Priyanka Singh (MPT - Musculoskeletal & Sports Rehab)**. The system connects the complete continuum of care—from patient enquiry and digital pre-assessment to advanced objective MSK evaluation, individualized treatment plans, session documentation, home exercise prescription, recovery tracking, discharge summaries, and clinic revenue management.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design and architectural choices have been tailored to your specifications:
> - **Lead Clinician Profile**: Configured Dr. Priyanka Singh as Chief Physiotherapist & Clinic Director, featuring her credentials, clinical specializations, consultation scheduling, and digital signature authorization on clinical notes.
> - **Revenue Generation & Billing Architecture**: Added a dedicated billing module with standard clinical tariff schedules (Initial Assessment, Follow-up Sessions, Manual Therapy, Dry Needling, Sports Conditioning, and Rehab Packages), invoice generation, payment status tracking (Paid, Partial, Pending), and clinic revenue analytics.
> - **Role Experience**: Built-in 4-role switcher (Clinic Owner/Dr. Priyanka Singh, Staff Physiotherapist, Front Desk Receptionist, and Patient) allowing seamless switching between clinical, administrative, and patient views.
> - **Reliable Persistence**: Complete structured state management backed by persistent browser LocalStorage with one-click JSON Backup Export and Restore, ensuring records survive reloads while remaining completely functional offline and in sandbox mode.

---

## 1. Overview & Core Concept

### What It Does
MOVEXA Care unifies clinical rigor with patient engagement:
1. **Intake & Registration**: Quick digital pre-assessment and patient registration with duplicate-check and medical safety screening.
2. **Advanced MSK Clinical Assessment**: 8 anatomical & condition templates (Knee, Low Back, Neck, Shoulder, Ankle/Foot, Elbow/Wrist, Sports Injury, General MSK) capturing subjective history, ROM, manual muscle testing, neurological screening, special orthopedic tests, palpation, and red flags.
3. **Treatment & Exercise Engine**: Problem list, short/long-term goals, exercise prescriptions with sets/reps/holds/frequency, and patient-facing visual exercise cards.
4. **Encounter Notes (SOAP)**: Signed encounter records with subjective updates, objective reassessment, interventions, patient tolerance, and next visit plans.
5. **Measurable Recovery Timeline**: Validated metrics (NPRS 0–10, Patient-Specific Functional Scale, Range of Motion degrees, Dynamometry/Strength) with baseline vs. current trend analysis.
6. **Billing & Revenue Operations**: Consultation charges, fee receipts, payment reconciliation, and financial reports (revenue, collection rate, service breakdown).
7. **Patient Home Portal**: Mobile-first portal where patients view prescribed exercises, log session completion, record pre/post pain scores, and request appointments.

### Target Audience & Personas
- **Dr. Priyanka Singh & Clinicians**: Streamlined clinical documentation, evidence-based tests, automated discharge summaries, and progress tracking.
- **Receptionists**: Fast appointment booking, enquiry management, intake dispatch, and billing receipt collection.
- **Patients**: Clear exercise instructions with dosage reminders, pain tracking, and care plan transparency.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Brand**: MOVEXA Care (MOVEXA Physiotherapy)
- **Tagline**: *“Clinical intelligence. Personalised rehabilitation. Measurable recovery.”*
- **Color Palette (60-30-10 discipline)**:
  - *Canvas (60%)*: Warm Ivory (`#FAF9F5`) and pure white (`#FFFFFF`) creating a calm, dignified clinical environment.
  - *Structural Surfaces (30%)*: Forest Green accents (`#1B4332`, `#2D6A4F`), soft warm stone borders (`#E5E5DF`), muted charcoal text (`#1F2937`), and subtle slate dividing lines.
  - *Accents (10%)*: High-intent sage green (`#52B788`) and amber warning cues (`#D97706`) strictly for status and primary interactive controls.
- **Typography**: Clean typographic hierarchy using `Plus Jakarta Sans` / `Outfit` for display and `Plus Jakarta Sans` for dense clinical data, paired with tabular numerals (`tabular-nums`) for pain scores, degrees of motion, and financial amounts.
- **Zero-Pill Discipline**: Metadata displayed as unboxed clean text separated by typographic middots (`·`). Interactive filter controls styled as segmented controls.
- **Layout Presence**: Desktop-first 1440px clinician workspace with a collapsible 260px clinical sidebar, breadcrumb header, and quick-action bar; plus a dedicated mobile-optimized patient portal layout.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Revenue & Billing Integration
- **Approach**: Built-in fee structure linked to clinical appointments and sessions. Each session links to a chargeable service code with transparent invoice status (Paid / Unpaid / Insurance Claimed).
- **Benefit**: Clinic owners immediately track revenue generation alongside clinical efficacy without requiring external disconnected spreadsheets.

### 2. Clinical Assessment Templates
- **Approach**: Dynamic body-region templates that show only relevant orthopedic tests and functional movements (e.g., Lachman/McMurray for Knee, Slump/Straight Leg Raise for Lumbar spine, Hawkins-Kennedy/Neer for Shoulder).
- **Benefit**: Eliminates clinical documentation fatigue while maintaining high-standard orthopedic documentation.

### 3. Patient Home Rehab Portal
- **Approach**: Separate mobile-friendly view switchable from the top bar or via simulated patient login.
- **Benefit**: Demonstrates the real two-sided value proposition where clinician prescription flows directly into the patient's daily rehab routine.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MOVEXA Care Application                         │
├────────────────────────────────────────────────────────────────────────┤
│ Top Navigation: Clinic Brand | Role Switcher | Quick Actions | Backup  │
├───────────────────┬────────────────────────────────────────────────────┤
│ Collapsible Nav   │ Main Viewport Router:                              │
│ - Dashboard       │  ├── Overview Dashboard (KPIs, Schedule, Alerts)   │
│ - Patients        │  ├── Patient Directory & 8-Tab Detailed Record     │
│ - Enquiries       │  ├── Digital Pre-Assessment Intake Form            │
│ - Appointments    │  ├── Advanced MSK Clinical Assessment Builder      │
│ - Assessments     │  ├── Treatment Plan & Exercise Prescription        │
│ - Sessions        │  ├── SOAP Session Notes with Clinician Signature   │
│ - Home Exercises  │  ├── Patient Home Rehab Portal (Mobile-Ready)      │
│ - Recovery Charts │  ├── Recovery Timeline & Validated Outcomes        │
│ - Billing/Revenue │  ├── Billing, Invoices & Revenue Generation        │
│ - Discharge       │  ├── Discharge Summary Generator (Print / PDF)     │
│ - Tasks/Follow-up │  ├── Tasks, Recalls & Reassessment Reminders       │
│ - Staff/Settings  │  └── Staff Directory & Clinic Revenue Analytics    │
├───────────────────┴────────────────────────────────────────────────────┤
│ State & Persistence Layer:                                             │
│ - Reactive Store (Patients, Appointments, Assessments, Bills, Tasks)   │
│ - Persistent LocalStorage Engine + JSON Export/Import                  │
│ - Optional AI Clinical Note Assistant (SOAP drafting, Red Flag audit)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Data Model
- **Patient**: ID, Name, DOB, Contact, Emergency Contact, Referral Source, Chief Complaint, Region, Precautions, Assigned Physio, Status.
- **PreAssessment**: Intake responses, pain map, functional restrictions, medical history, red flag screening.
- **ClinicalAssessment**: Subjective, Observation, Gait, ROM (Active/Passive), MMT (0-5), Special Tests (Positive/Negative/Indeterminate), Red Flags, Problem List, Working Hypothesis, Management Plan.
- **TreatmentPlan**: Goals (Short/Long-term), Interventions, Frequency, Review Date, Exercise Prescriptions (Name, Sets, Reps, Hold, Frequency, Video Ref, Notes).
- **SessionNote**: Date, Session #, Subjective Changes, Pain Score, Interventions, Tolerance, Home Plan Updates, Signed By Dr. Priyanka Singh / Staff.
- **Invoice & Revenue Record**: Invoice #, Patient ID, Service Rendered, Date, Base Fee, Tax/Discount, Total Due, Payment Status, Payment Method.
- **OutcomeRecord**: Date, NPRS (0-10), PSFS score (0-10), Joint ROM (degrees), Strength (kg/grade), Clinician Comments.

---

## Implementation Steps Planned

1. **Brand & Typography Shell**: Update `metadata.json`, `index.html` with MOVEXA Care titles, fonts, and Tailwind styles.
2. **Data Store & Mock Seed**: Implement realistic clinical data including Dr. Priyanka Singh as Chief Physiotherapist, realistic patient cohorts with knee ACL rehab, lumbar radiculopathy, rotator cuff tendinopathy, and cervical strain.
3. **Role Switcher & App Shell**: Top bar with role selection (Admin/Dr. Priyanka Singh, Physiotherapist, Receptionist, Patient) and notification center.
4. **Executive Clinician Dashboard**: Today's queue, appointment attendance, active caseload, documentation alerts, and revenue KPI cards.
5. **Patient Directory & 8-Tab Profile**: Complete patient dossiers with overview, assessment history, treatment plans, exercise prescriptions, and invoices.
6. **Digital Pre-Assessment Intake**: Patient self-service intake questionnaire with conditional body region prompts.
7. **Advanced MSK Assessment Suite**: Interactive assessment builder with 8 regional templates and safety red flag checks.
8. **Treatment Plan Builder & Exercise Prescriber**: Interactive prescription builder with visual exercise library.
9. **Treatment Session (SOAP) Documentation**: Timestamped clinical notes with electronic sign-off.
10. **Patient Home Portal View**: Interactive exercise check-in, pain slider feedback, and appointment request.
11. **Outcome Analytics & Recovery Timeline**: Visual charts for NPRS, PSFS, and ROM comparisons over time.
12. **Billing & Revenue Management**: Tariffs, invoice generation, payment status filters, and revenue analytics.
13. **Discharge Summary & Export**: Clinician-reviewed discharge summary generator with clean printable layout.
14. **Settings & Data Backup**: Export/Import JSON database backup, clinic staff management, and system preferences.
