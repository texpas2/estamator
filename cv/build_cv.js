const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, ExternalHyperlink, LevelFormat, convertInchesToTwip
} = require("docx");
const fs = require("fs");

const NAVY = "1F3864";
const GREY = "595959";
const RULE = { bottom: { color: NAVY, space: 2, style: BorderStyle.SINGLE, size: 8 } };

const name = (t) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 20 },
  children: [new TextRun({ text: t, bold: true, size: 40, color: NAVY, font: "Calibri", characterSpacing: 20 })]
});

const tagline = (t) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [new TextRun({ text: t, size: 22, color: GREY, font: "Calibri" })]
});

const contact = (parts) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 180 },
  children: parts
});

const c = (t) => new TextRun({ text: t, size: 18, color: GREY, font: "Calibri" });
const sep = () => new TextRun({ text: "   •   ", size: 18, color: "AAAAAA", font: "Calibri" });
const link = (text, url) => new ExternalHyperlink({
  link: url, children: [new TextRun({ text, size: 18, color: "1155CC", font: "Calibri" })]
});

const section = (t) => new Paragraph({
  spacing: { before: 260, after: 120 }, border: RULE,
  children: [new TextRun({ text: t.toUpperCase(), bold: true, size: 21, color: NAVY, font: "Calibri", characterSpacing: 30 })]
});

// Job header: title + employer on line 1, dates + location on line 2
const job = (title, employer, dates, location) => ([
  new Paragraph({
    spacing: { before: 140, after: 0 },
    children: [
      new TextRun({ text: title, bold: true, size: 21, color: "000000", font: "Calibri" }),
      new TextRun({ text: "  |  ", size: 21, color: "AAAAAA", font: "Calibri" }),
      new TextRun({ text: employer, size: 21, color: NAVY, font: "Calibri" })
    ]
  }),
  new Paragraph({
    spacing: { after: 70 },
    children: [new TextRun({ text: dates + (location ? "   ·   " + location : ""), italics: true, size: 18, color: GREY, font: "Calibri" })]
  })
]);

const bullet = (t, lvl = 0) => new Paragraph({
  numbering: { reference: "cv-bullets", level: lvl },
  spacing: { after: 30 }, indent: { left: convertInchesToTwip(0.25 + lvl * 0.22), hanging: convertInchesToTwip(0.16) },
  children: [new TextRun({ text: t, size: 19, font: "Calibri" })]
});

// "Label: value" run-on line, used for project lists
const labeled = (label, value) => new Paragraph({
  spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) },
  children: [
    new TextRun({ text: label + " ", bold: true, size: 19, font: "Calibri" }),
    new TextRun({ text: value, size: 19, font: "Calibri" })
  ]
});

const body = (t, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 60 }, alignment: AlignmentType.JUSTIFIED,
  children: [new TextRun({ text: t, size: 19, font: "Calibri" })]
});

const subhead = (t) => new Paragraph({
  spacing: { before: 100, after: 40 },
  children: [new TextRun({ text: t, bold: true, size: 19, color: GREY, font: "Calibri" })]
});

const skill = (label, value) => new Paragraph({
  spacing: { after: 40 },
  children: [
    new TextRun({ text: label + ": ", bold: true, size: 19, font: "Calibri" }),
    new TextRun({ text: value, size: 19, font: "Calibri" })
  ]
});

const doc = new Document({
  creator: "Oleksii Podolianchuk",
  title: "Oleksii Podolianchuk - Process / Project Engineer - CV",
  numbering: {
    config: [{
      reference: "cv-bullets",
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT }
      ]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 720, bottom: 720, left: 900, right: 900 }
      }
    },
    children: [

      name("OLEKSII PODOLIANCHUK"),
      tagline("Process Engineer  ·  Project Engineer  —  Gas Processing, LNG & Specialty Chemicals"),
      contact([
        c("25003 Lenora Dr, Katy, TX 77493"), sep(),
        c("+1 551 248 3810"), sep(),
        link("oleksii.podolianchuk@gmail.com", "mailto:oleksii.podolianchuk@gmail.com"), sep(),
        link("LinkedIn", "https://www.linkedin.com/in/oleksii-podolianchuk-86ab6590/")
      ]),

      section("Professional Summary"),
      body("Process and project engineer with over a decade of design and delivery experience on greenfield and brownfield gas processing plants, gas compression stations, LNG facilities and specialty chemical units, across pre-FEED, FEED and detailed design. Currently a Project Engineer at Sulzer, supporting capital projects for ExxonMobil, BioFlux (Tulsa, Oklahoma) and a polylactic acid (PLA) plant in Kazakhstan."),
      body("Deep hands-on background in process design deliverables — heat and mass balances, PFD/UFD and P&ID development, equipment and line sizing, hydraulics, relief and flare systems, and equipment specifications — executed to international standards and to GOST/SNiP codes. Repeated participation in HAZOP, HAZID and SIL classification studies, and trained as a HAZOP leader. Proficient in UniSim."),
      body("Combines that technical base with running his own Texas construction services company from 2019 to 2025, bringing direct U.S. experience in estimating, bidding, procurement, subcontractor management and project delivery to American clients."),

      section("Professional Experience"),

      ...job("Project Engineer", "Sulzer", "January 2026 – Present", "[Houston / Tulsa — confirm office]"),
      bullet("Delivers project engineering across capital projects executed from Sulzer\u2019s U.S. organization, coordinating process, mechanical and packaging scope from proposal through design and fabrication."),
      bullet("Interfaces between client engineering teams, internal technology groups and vendors, managing technical queries, deviations and change through the project lifecycle."),
      bullet("Reviews and develops process deliverables — datasheets, specifications, mass balances and equipment sizing — for compliance with client requirements and applicable codes and standards."),
      bullet("Supports project planning, cost estimating input and schedule reporting for assigned scope."),
      subhead("Projects"),
      labeled("ExxonMobil —", "[unit / site / scope — confirm]"),
      labeled("BioFlux, Tulsa, Oklahoma —", "[scope and capacity — confirm]"),
      labeled("PLA (polylactic acid) plant, Kazakhstan —", "[capacity, project phase — confirm]"),

      ...job("Owner & Founder", "BestTileSolution LLC", "2019 – 2025", "Katy, Texas"),
      bullet("Founded and operated a Texas construction services company providing tile and flooring installation to residential and commercial clients in the greater Houston area."),
      bullet("Held full responsibility for the business: takeoffs and estimating, bidding, client contracts, procurement, scheduling, subcontractor management, quality control and site safety."),
      bullet("Managed P&L, cash flow, licensing, insurance and regulatory compliance for the entity."),
      bullet("[Add: approximate annual revenue, number of projects completed, crew size — these quantify the role and are worth including.]"),

      ...job("Senior Process Engineer", "Sakhalin Energy Investment Company Ltd. (Shell)", "August 2015 – March 2019", ""),
      bullet("Provided process discipline technical assurance across the project portfolio, justifying design decisions against safety requirements and project technical specifications."),
      bullet("Performed and reviewed process modelling and analysis to recommend optimal technical solutions for project implementation."),
      bullet("Reviewed technical design documentation produced by design institutes and specialist contractors for compliance with project process requirements."),
      bullet("Made and endorsed decisions safeguarding the technical integrity of the process discipline scope."),
      bullet("Developed and reviewed equipment specifications; advised on new technologies and on improving the efficiency of existing processes."),
      bullet("Maintained core process documentation — process flow schemes, line lists and equipment data — and managed project process information."),
      bullet("Supplied process input to project planning, scheduling, cost estimating and project reporting."),
      bullet("Coordinated with other engineering disciplines and with contractor process specialists to maintain an integrated design; contributed to preparation of project contracts."),
      subhead("Assets supported"),
      bullet("Onshore Process Facilities (Parsons)"),
      bullet("Booster Station, Onshore Process Facilities (Petrofac)"),
      bullet("Prigorodnoye LNG (Wood Group)"),
      bullet("Lunskaya-A (LUN-A) platform (Wood Group)"),
      bullet("Molikpaq (Piltun-Astokhskaya-A) platform (Wood Group)"),
      bullet("Piltun-Astokhskaya-B platform (Wood Group)"),

      ...job("Senior Process Engineer", "PJSC “YUZHNIIGIPROGAZ”", "March 2012 – August 2015", "Ukraine"),
      bullet("Led the process engineering team in developing design scope, ensuring deliverables complied with applicable codes, standards and project and corporate procedures."),
      bullet("Controlled development of flow diagrams, P&IDs, equipment sizing, hydraulic calculations, energy requirements, specifications and datasheets through basic design."),
      bullet("Controlled RFQ package development, technical bid analysis, and drawing and document review through detailed design."),
      bullet("Provided data analysis during conceptual design using computer-aided techniques."),
      bullet("Monitored team activity against project schedule and budget, and escalated technical, schedule and cost issues to the Project Manager and Process Group Supervisor for timely corrective action."),
      bullet("Attended and contributed to P&ID reviews, HAZOP and HAZID studies."),
      subhead("Projects"),
      bullet("Sakhalin-2, Onshore Process Facilities (Shell) — FEED"),
      bullet("Orenburg Gas Processing Plant (Technip) — FEED and detailed design"),
      bullet("Astrakhan Gas Processing Plant (Technip) — detailed design"),
      bullet("Orenburg Helium Plant facilities (Gazprom) — management of change"),
      bullet("Purovsky LPG Processing Plant (Novatek) — FEED and detailed design"),

      ...job("Process Engineer", "PJSC “YUZHNIIGIPROGAZ”", "March 2009 – March 2012", "Ukraine"),
      bullet("Prepared heat and mass balances and design basis documentation."),
      bullet("Produced PFDs, UFDs and P&IDs."),
      bullet("Sized equipment — tanks, phase separators, indirect bath heaters — and pumps, compressors and control valves."),
      bullet("Performed line sizing, hydraulic calculations and PSV sizing."),
      bullet("Prepared process and process-instrument datasheets, line lists, equipment lists and utility summaries."),
      subhead("Projects"),
      bullet("Astrakhan Gas Processing Plant (Technip) — FEED"),
      bullet("Sakhalin-2, Onshore Process Facilities (Shell) — pre-FEED"),
      bullet("Amur Gas Processing Plant, Chayandinskoye and Kovyktinskoye fields (Gazprom) — cost investigation analysis and pre-FEED"),
      bullet("Samburgskoye Gas Processing Plant (Novatek) — FEED"),
      bullet("Shtokman Onshore LNG Process Facilities (Technip) — FEED"),
      bullet("Orenburg Gas Processing Plant (Technip) — management of change"),
      bullet("Purovsky LPG Processing Plant (Novatek) — FEED and detailed design"),
      bullet("Orenburg Helium Plant facilities (Technip) — FEED and detailed design"),

      section("Education"),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "Bachelor of Science, Chemical Engineering", bold: true, size: 19, font: "Calibri" }),
          new TextRun({ text: "  —  2008", size: 19, color: GREY, font: "Calibri" })
        ]
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Donetsk National Technical University, Ukraine", size: 19, color: GREY, font: "Calibri" })]
      }),

      section("Professional Development"),
      bullet("Advanced Relief and Flare Systems (AMO404) — Shell, Netherlands (2017)"),
      bullet("Multiphase Flow (P224) — Shell, Netherlands (2016)"),
      bullet("Technical Safety Engineering Foundation Course (TSE 101) — Shell, Netherlands (2015)"),
      bullet("HAZOP Leader Training Course — PSN (2015)"),
      bullet("Liquefied Natural Gas: Understanding the Basic Facts — Sakhalin Energy (2015)"),
      bullet("AutoCAD MEP 2012 — Autodesk (2012)"),
      bullet("AVEVA PDMS 12.1 Equipment & Piping Design, AVEVA Diagrams — AVEVA, Hungary (2011)"),

      section("Technical Skills"),
      skill("Concept & basis of design", "PFS/PFD, design philosophies, basis of design package (BDP)"),
      skill("Process design", "PEFS/P&ID, basic engineering design package (BDEP), equipment and line sizing, hydraulics, PSV and relief sizing, datasheets and specifications"),
      skill("Modelling & analysis", "UniSim; heat and mass balance; flow assurance (hydrate and wax management); multiphase flow"),
      skill("Process safety", "HAZOP, HAZID, SIL classification, relief and flare systems, management of change"),
      skill("Operations support", "PI data analysis, process unit troubleshooting and optimization"),
      skill("Project delivery", "pre-FEED / FEED / detailed design, RFQ and technical bid evaluation, vendor and contractor interface, estimating input, schedule and budget monitoring"),
      skill("Software", "UniSim, AutoCAD MEP, AVEVA PDMS, AVEVA Diagrams, MS Project, MS Office"),
      skill("Languages", "[English — level; Ukrainian — native; Russian — fluent — confirm]"),

      section("Additional"),
      skill("Work authorization", "[Confirm — e.g. authorized to work in the U.S. without sponsorship / current status]"),
      skill("Location", "Katy, Texas — U.S. Gulf Coast"),
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync("/tmp/claude-0/-home-user-estamator/63bba5fd-da56-5f1e-b069-8a2ef51e384e/scratchpad/cv/Oleksii_Podolianchuk_CV_2026.docx", b);
  console.log("written");
});
