import ministersJson from "./ministers_list.json";

export interface ScamOrCorruption {
  title: string;
  financialImpact: string;
  description: string;
  status: string;
}

export interface WorkAchievement {
  achievement: string;
  outlay: string;
  status: string;
}

export interface WorkScoreBreakdown {
  schemeDelivery: number; // /100
  integrityAndCleanGovernance: number; // /100
  policyCompetence: number; // /100
  publicResponsiveness: number; // /100
  overallScore: number; // /100
}

export interface MinisterProfile {
  id?: string;
  name: string;
  title: string;
  currentPosition: string;
  ministry: string;
  party: string;
  since?: string;
  photoUrl?: string;
  education: string;
  educationDetails?: { degree: string; institution: string; summary: string };
  educationScore?: number;
  criminalCases: number;
  seriousCriminalCases?: number;
  criminalCaseNote?: string;
  affidavitYear?: number;
  wikiTitle?: string;
  assetGrowthPct?: number | null;
  assetGrowthPercent?: number;
  assetGrowthNote?: string;
  slug: string;
  scamsAndCorruption?: ScamOrCorruption[];
  controversies?: string[];
  epicFailures?: string[];
  keyWorks?: WorkAchievement[];
  workScoreBreakdown?: WorkScoreBreakdown;
  performanceScore?: number;
  caseLinks?: { label: string; url: string }[];
  declaredAssetsCr?: number;
  totalAssetsCr?: number;
  declaredAssetsPrevCr?: number;
  declaredAssetsYear?: number;
  declaredAssetsPrevYear?: number;
  liabilitiesCr?: number;
  officialResidence?: string;
  cagReportIds?: string[];
  constituency?: string;
  stateName?: string;
  stateCode?: string;
  isCM?: boolean;
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/["'()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const COMPREHENSIVE_LEADERS: Record<string, Partial<MinisterProfile>> = {
  "mamata-banerjee": {
    name: "Mamata Banerjee",
    slug: "mamata-banerjee",
    title: "Chief Minister of West Bengal",
    currentPosition: "Chief Minister of West Bengal (3rd Consecutive Term since 2011), Minister for Home & Hill Affairs, Health & Family Welfare, Land & Land Reforms",
    ministry: "West Bengal — Home, Health, Land & Information",
    party: "All India Trinamool Congress (AITC)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mamata_Banerjee_in_2021.jpg/800px-Mamata_Banerjee_in_2021.jpg",
    education: "MA Islamic History (Univ of Calcutta); LLB (Jogesh Chandra Chaudhuri Law College); BA History (Jogamaya Devi College)",
    educationDetails: {
      degree: "Master of Arts (MA) & Bachelor of Laws (LLB)",
      institution: "University of Calcutta & Jogesh Chandra Chaudhuri Law College",
      summary: "Graduated with BA in History from Jogamaya Devi College; earned MA in Islamic History from University of Calcutta and LLB from Jogesh Chandra Chaudhuri Law College."
    },
    declaredAssetsCr: 0.15,
    totalAssetsCr: 0.15,
    liabilitiesCr: 0.0,
    assetGrowthPct: 0,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "No active personal criminal convictions declared in 2021/2024 ECI Form 26 affidavits; lowest declared assets among all Indian Chief Ministers.",
    constituency: "Bhabanipur, Kolkata, West Bengal",
    stateName: "West Bengal",
    stateCode: "WB",
    isCM: true,
    scamsAndCorruption: [
      {
        title: "SSSC School Teacher Recruitment Scam",
        financialImpact: "₹15,000+ Crore",
        description: "Cash-for-jobs racket in State School Service Commission (SSSC); ₹50+ Cr in cash & gold seized by ED from Education Minister Partha Chatterjee's premises. Calcutta High Court cancelled 25,753 illegal teacher appointments in 2024.",
        status: "CBI / ED Trial & Supreme Court Review"
      },
      {
        title: "Saradha & Rose Valley Chit Fund Scams",
        financialImpact: "₹20,000+ Crore",
        description: "Unregulated deposit Ponzi schemes defrauding 1.8+ million rural depositors across Bengal, leading to CBI interrogations of top state leadership and police chiefs.",
        status: "CBI Investigation & Ongoing Trials"
      },
      {
        title: "Ration Distribution Scam & Illegal Coal Mining",
        financialImpact: "₹2,500+ Crore",
        description: "ED arrested former Food Minister Jyotipriya Mallick for siphoning PDS subsidized wheat/rice; parallel CBI probe into Asansol coal smuggling syndicate.",
        status: "Charge-sheeted by ED"
      }
    ],
    epicFailures: [
      {
        achievement: "RG Kar Medical College Hospital Crisis (2024)",
        outlay: "Statewide Health Disruption",
        status: "Nationwide outrage over rape-murder of on-duty trainee doctor, evidence mishandling, and month-long junior doctors strike leading to administrative reshuffles."
      } as any,
      {
        achievement: "Post-Poll Violence & Law and Order Breakdown (2021)",
        outlay: "National Human Rights Commission (NHRC) Censure",
        status: "NHRC fact-finding committee reported systemic displacement and intimidation of opposition political workers following the 2021 assembly election results."
      } as any,
      {
        achievement: "Singur Industrial Exit & Private Capex Lag",
        outlay: "Loss of ₹1,500 Cr Tata Nano Factory",
        status: "2008 anti-land acquisition agitation forced Tata Motors to relocate to Gujarat, creating a long-term deterrent for large-scale heavy manufacturing in Bengal."
      } as any
    ] as any,
    controversies: [
      "Sandeshkhali land grabbing and women harassment allegations against local party leaders (2024)",
      "DA (Dearness Allowance) parity agitation by State Government employees",
      "Repeated clashes with Raj Bhavan / Governor on University Vice-Chancellor appointments"
    ],
    keyWorks: [
      {
        achievement: "Lakshmir Bhandar Basic Income Scheme",
        outlay: "₹12,000 Cr / Year",
        status: "Monthly DBT cash support of ₹1,000-₹1,200 to 2.1 Crore women across West Bengal."
      },
      {
        achievement: "Kanyashree Prakalpa (UN Public Service Award)",
        outlay: "₹10,500 Cr Cumulative",
        status: "Conditional educational cash transfer that brought down female school dropouts to below 12%."
      },
      {
        achievement: "Duare Sarkar (Government at Doorstep)",
        outlay: "5+ Lakh Outreach Camps",
        status: "Delivered on-the-spot caste certificates, ration cards, and welfare enrollments to 6.8 Crore citizens."
      },
      {
        achievement: "Swasthya Sathi Universal Health Scheme",
        outlay: "₹2,500 Cr / Year",
        status: "Cashless secondary and tertiary health cover of ₹5 Lakh/year issued in the name of the female head of family."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 88,
      integrityAndCleanGovernance: 48,
      policyCompetence: 76,
      publicResponsiveness: 62,
      overallScore: 72
    },
    performanceScore: 72
  },

  "narendra-modi": {
    name: "Narendra Modi",
    slug: "narendra-modi",
    title: "Prime Minister of India",
    currentPosition: "Prime Minister of India (3rd Consecutive Term since 2014), Minister of Personnel, Public Grievances, Department of Atomic Energy, Department of Space",
    ministry: "Prime Minister's Office (PMO) · Atomic Energy · Space · Personnel",
    party: "Bharatiya Janata Party (BJP / NDA)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/800px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",
    education: "MA Political Science (Gujarat University, 1983); BA Political Science (SOL, University of Delhi, 1978)",
    educationDetails: {
      degree: "Master of Arts (MA) in Political Science",
      institution: "Gujarat University (1983) & University of Delhi (1978)",
      summary: "Completed BA in Political Science through distance education from Delhi University in 1978; obtained MA in Political Science with first class from Gujarat University in 1983."
    },
    declaredAssetsCr: 3.02,
    totalAssetsCr: 3.02,
    liabilitiesCr: 0.0,
    assetGrowthPct: 21,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal cases declared across all Parliamentary election affidavits (2014, 2019, 2024).",
    constituency: "Varanasi, Uttar Pradesh",
    scamsAndCorruption: [
      {
        title: "Electoral Bonds Anonymous Funding Scheme",
        financialImpact: "₹16,518 Crore Encashed",
        description: "Scheme permitting unlimited anonymous corporate funding struck down as unconstitutional and violative of voters' right to information by Supreme Court in Feb 2024.",
        status: "Struck Down by Supreme Court of India"
      },
      {
        title: "Rafale Aircraft Procurement Offset Controversy",
        financialImpact: "₹59,000 Crore Defense Deal",
        description: "Opposition allegations over Dassault Aviation's joint venture partner selection; Supreme Court of India dismissed review petitions in 2019 finding no irregularities in pricing or procedure.",
        status: "Dismissed by Supreme Court (Clean Chit)"
      }
    ],
    epicFailures: [
      {
        achievement: "Demonetization (Nov 2016)",
        outlay: "86% Currency Notes Invalidated",
        status: "Overnight invalidation of ₹500/₹1,000 notes caused prolonged cash shortages, MSME supply chain disruption, and temporary GDP growth deceleration."
      } as any,
      {
        achievement: "Three Farm Laws & 2020-21 Farmers' Agitation",
        outlay: "Parliamentary Repeal (Nov 2021)",
        status: "Year-long blockade of Delhi borders by farmer unions led to unconditional repeal of three agricultural reform acts in Parliament."
      } as any,
      {
        achievement: "COVID-19 Second Wave Crisis (April-May 2021)",
        outlay: "Severe Medical Deficit",
        status: "Delta variant surge overwhelmed hospital infrastructure, causing nationwide medical oxygen shortages and crematoria backlogs."
      } as any,
      {
        achievement: "Manipur Civil & Ethnic Conflict (2023-2025)",
        outlay: "60,000+ Displaced Citizens",
        status: "Prolonged ethnic violence between Meitei and Kuki communities, destruction of armories, and delayed political reconciliation."
      } as any
    ] as any,
    controversies: [
      "PM CARES Fund transparency and exemption from direct CAG performance audit",
      "Pegasus spyware surveillance allegations against journalists and opposition figures",
      "Central agencies (ED/CBI) enforcement patterns disproportionately targeting opposition leaders"
    ],
    keyWorks: [
      {
        achievement: "Jal Jeevan Mission & PM Awas Yojana",
        outlay: "₹70,000+ Cr / Year",
        status: "Delivered 14.8 Crore rural functional tap water connections and 4.2+ Crore permanent pucca houses."
      },
      {
        achievement: "Digital Public Infrastructure (UPI & Aadhaar DBT)",
        outlay: "₹34+ Lakh Crore DBT Transferred",
        status: "Pioneered world's largest digital payments infrastructure (13+ billion monthly UPI transactions) eliminating leakages."
      },
      {
        achievement: "National Highway & Expressway Modernization",
        outlay: "₹2.7 Lakh Cr Annual Capex",
        status: "Expanded National Highway network by 60% (from 91,287 km in 2014 to 146,145 km in 2024)."
      },
      {
        achievement: "Ayushman Bharat PM-JAY & Jan Aushadhi",
        outlay: "55+ Crore Beneficiaries",
        status: "Provided ₹5 Lakh/year cashless hospital cover with 6.5+ Crore hospital claims reimbursed."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 92,
      integrityAndCleanGovernance: 78,
      policyCompetence: 88,
      publicResponsiveness: 74,
      overallScore: 84
    },
    performanceScore: 84
  },

  "amit-shah": {
    name: "Amit Shah",
    slug: "amit-shah",
    title: "Union Minister of Home Affairs & Cooperation",
    currentPosition: "Union Minister of Home Affairs and Minister of Cooperation, Government of India (MP for Gandhinagar)",
    ministry: "Ministry of Home Affairs · Ministry of Cooperation",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Amit_Shah_in_2023.jpg/800px-Amit_Shah_in_2023.jpg",
    education: "BSc Biochemistry (CU Shah Science College, Gujarat University)",
    educationDetails: {
      degree: "Bachelor of Science (BSc) in Biochemistry",
      institution: "CU Shah Science College, Ahmedabad, Gujarat University",
      summary: "Graduated with BSc in Biochemistry; worked in family PVC pipe manufacturing business and stockbroking before entering full-time state and national politics."
    },
    declaredAssetsCr: 65.7,
    totalAssetsCr: 65.7,
    liabilitiesCr: 15.4,
    assetGrowthPct: 63,
    criminalCases: 3,
    seriousCriminalCases: 3,
    criminalCaseNote: "3 political protest cases declared in 2024 affidavit. Discharged from historical 2005 Sohrabuddin Sheikh encounter case by Special CBI Court in 2014 for lack of prima facie evidence.",
    constituency: "Gandhinagar, Gujarat",
    scamsAndCorruption: [
      {
        title: "Pegasus Surveillance & Snooping Allegations",
        financialImpact: "Constitutional Privacy Review",
        description: "Allegations of military-grade spyware deployed against Indian journalists, political leaders, and constitutional authorities; Supreme Court Technical Committee noted government non-cooperation.",
        status: "Supreme Court Oversight"
      }
    ],
    epicFailures: [
      {
        achievement: "Manipur Security & Ethnic Peace Deficit (2023-2025)",
        outlay: "Statewide Unrest",
        status: "Delayed disarmament of underground groups and prolonged administrative breakdown between hill and valley districts."
      } as any,
      {
        achievement: "Northeast Delhi Riots Intelligence Failure (Feb 2020)",
        outlay: "53 Casualties",
        status: "Delhi Police response criticized by High Court for delayed deployment and preventive intelligence gaps during communal clashes."
      } as any
    ] as any,
    controversies: [
      "Citizenship Amendment Act (CAA) & NRC nationwide protests and prolonged notification timeline",
      "Opposition claims of weaponizing Enforcement Directorate (ED) against non-NDA states",
      "Delimitation and federal tax devolution debates between southern and northern states"
    ],
    keyWorks: [
      {
        achievement: "Abrogation of Article 370 & J&K Reorganization",
        outlay: "Constitutional Integration",
        status: "Revoked special status of Jammu & Kashmir, integrated legal framework, and conducted assembly elections with 63.8% turnout."
      },
      {
        achievement: "Bharatiya Nyaya Sanhita (Replacement of IPC/CrPC)",
        outlay: "Overhaul of 160-Year-Old Colonial Codes",
        status: "Enacted BNS, BNSS, and BSA criminal laws instituting digital evidence rules, zero FIRs, and forensic mandates."
      },
      {
        achievement: "Cooperative Computerization & PACS Modernization",
        outlay: "₹2,516 Crore Outlay",
        status: "Computerized 63,000+ Primary Agricultural Credit Societies and launched National Cooperative Export Society."
      },
      {
        achievement: "Naxalism & Left-Wing Extremism Containment",
        outlay: "Security Grid Operations",
        status: "Shrank Left-Wing Extremism security operational districts from 126 in 2014 to fewer than 38 in 2024."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 88,
      integrityAndCleanGovernance: 72,
      policyCompetence: 84,
      publicResponsiveness: 70,
      overallScore: 80
    },
    performanceScore: 80
  },

  "nitin-gadkari": {
    name: "Nitin Gadkari",
    slug: "nitin-gadkari",
    title: "Union Minister of Road Transport & Highways",
    currentPosition: "Union Minister of Road Transport and Highways, Government of India (MP for Nagpur)",
    ministry: "Ministry of Road Transport and Highways (MoRTH)",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Nitin_Gadkari_in_2023.jpg/800px-Nitin_Gadkari_in_2023.jpg",
    education: "MCom, LLB, Diploma in Business Management (Nagpur University)",
    educationDetails: {
      degree: "MCom, LLB & Diploma in Business Management",
      institution: "G.S. College of Commerce & Economics, Nagpur University",
      summary: "Graduated with MCom, obtained LLB law degree and Diploma in Business Management from Nagpur University."
    },
    declaredAssetsCr: 28.03,
    totalAssetsCr: 28.03,
    liabilitiesCr: 12.8,
    assetGrowthPct: 18,
    criminalCases: 10,
    seriousCriminalCases: 5,
    criminalCaseNote: "Cases relate to political demonstrations, public protests, and election violation charges; zero personal criminal convictions.",
    constituency: "Nagpur, Maharashtra",
    scamsAndCorruption: [
      {
        title: "CAG Audit on Dwarka Expressway Cost Escalation",
        financialImpact: "₹250.7 Cr/km vs ₹18.2 Cr/km Planned",
        description: "CAG Audit Report No. 14 of 2023 flagged significant cost escalations on the 29-km Dwarka Expressway elevated corridor; Ministry clarified that 8-lane elevated structure with tunnels required specialized engineering specifications.",
        status: "Clarified in Parliamentary Action Taken Report"
      },
      {
        title: "NHAI Debt Accumulation (₹3.48 Lakh Crore)",
        financialImpact: "₹3,48,000 Crore Debt Peak",
        description: "Aggressive borrowing for land acquisition and BOT-HAM projects caused NHAI debt to surge, requiring Union Budget restructuring to direct budgetary grants.",
        status: "Resolved via Budgetary Allocation"
      }
    ],
    epicFailures: [
      {
        achievement: "Toll Plaza Fee Friction & User Discontent",
        outlay: "₹54,000+ Cr Toll Revenue",
        status: "Public criticism over collection of full toll charges on uncompleted, under-construction, or heavily congested expressway stretches."
      } as any,
      {
        achievement: "Himalayan Highway Landslides & Char Dham Cave-ins",
        outlay: "Silkyara Tunnel Collapse (2023)",
        status: "41 workers trapped inside Silkyara tunnel for 17 days due to geological collapse; highlighted safety audit deficits in fragile Himalayan terrain."
      } as any
    ] as any,
    controversies: [
      "FASTag automated toll deduplication disputes",
      "Purti Group historical business audit inquiry (cleared in 2013-14)",
      "Strict vehicle scrappage policy adoption challenges among commercial transporters"
    ],
    keyWorks: [
      {
        achievement: "Record National Highway Construction Velocity",
        outlay: "₹2.78 Lakh Crore FY25 Outlay",
        status: "Increased average daily highway construction from 12 km/day (2014) to 37 km/day peak (13,327 km built in a single year)."
      },
      {
        achievement: "Greenfield Expressway Network (Delhi-Mumbai, Samruddhi)",
        outlay: "27 Greenfield Corridors",
        status: "Built access-controlled corridors reducing travel times by 40-50% across major commercial freight routes."
      },
      {
        achievement: "Ethanol Blending & Flex-Fuel Vehicle Mission",
        outlay: "20% Ethanol Blending (E20)",
        status: "Saved ₹90,000+ Cr in crude oil import foreign exchange while supporting sugarcane farmer incomes."
      },
      {
        achievement: "100% FASTag Electronic Toll Collection",
        outlay: "₹20,000 Cr Fuel Savings",
        status: "Reduced average toll plaza wait time from 734 seconds to 47 seconds across 1,000+ toll plazas."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 95,
      integrityAndCleanGovernance: 79,
      policyCompetence: 92,
      publicResponsiveness: 78,
      overallScore: 87
    },
    performanceScore: 87
  },

  "nirmala-sitharaman": {
    name: "Nirmala Sitharaman",
    slug: "nirmala-sitharaman",
    title: "Union Minister of Finance & Corporate Affairs",
    currentPosition: "Union Minister of Finance and Minister of Corporate Affairs, Government of India (Rajya Sabha MP for Karnataka)",
    ministry: "Ministry of Finance · Ministry of Corporate Affairs",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nirmala_Sitharaman_2023.jpg/800px-Nirmala_Sitharaman_2023.jpg",
    education: "MPhil & MA Economics (CESP, JNU, New Delhi); BA Economics (Seethalakshmi Ramaswami College, Trichy)",
    educationDetails: {
      degree: "Master of Philosophy (MPhil) & MA in Economics",
      institution: "Centre for Economic Studies and Planning (CESP), JNU & Seethalakshmi Ramaswami College",
      summary: "Earned BA in Economics from Seethalakshmi Ramaswami College, Tiruchirappalli (1980); completed MA in Economics and MPhil from Jawaharlal Nehru University (JNU), New Delhi."
    },
    declaredAssetsCr: 2.53,
    totalAssetsCr: 2.53,
    liabilitiesCr: 0.35,
    assetGrowthPct: 12,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal cases declared across all Rajya Sabha election affidavits; impeccable clean personal integrity record.",
    constituency: "Rajya Sabha, Karnataka",
    scamsAndCorruption: [
      {
        title: "Zero Personal Corruption Allegations",
        financialImpact: "₹0 Cr Loss",
        description: "Zero corruption charges or CAG personal propriety findings during tenure across Defence and Finance ministries.",
        status: "Impeccable Personal Record"
      }
    ],
    epicFailures: [
      {
        achievement: "LTCG Indexation Removal & Real Estate Backlash (Budget 2024)",
        outlay: "Parliamentary Amendment Rollback",
        status: "Removal of indexation benefits on properties purchased before 2024 sparked middle-class outrage, requiring government amendment to restore taxpayer choice."
      } as any,
      {
        achievement: "Food & Vegetable Inflation Pressures (2023-2024)",
        outlay: "Elevated Retail Inflation",
        status: "Repeated spikes in tomato, onion, and pulse prices (crossing 10% food inflation) strained household budgets and squeezed consumer demand."
      } as any
    ] as any,
    controversies: [
      "Corporate tax cut of 2019 (foregoing ₹1.45L Cr revenue) without proportional private capex boom",
      "GST compliance overhead for small MSMEs and input tax credit fraud audits",
      "Rupee depreciation testing ₹83.5–₹84 per USD"
    ],
    keyWorks: [
      {
        achievement: "Record Monthly GST Revenue Collections",
        outlay: "₹1.80L – ₹2.10L Cr / Month",
        status: "Formalized Indian tax base and stabilized indirect tax collections across all 28 states."
      },
      {
        achievement: "Banking Sector Gross NPA Cleanup (11.2% to 2.8%)",
        outlay: "Insolvency & Bankruptcy Code (IBC)",
        status: "Turned around public sector banks into recording record cumulative profits of ₹1.4+ Lakh Crore."
      },
      {
        achievement: "Quadrupling Central Infrastructure Capex",
        outlay: "₹11.11 Lakh Crore FY25",
        status: "Expanded public capital expenditure 4x (from ₹3.1L Cr in FY19 to ₹11.11L Cr in FY25) crowding in private investments."
      },
      {
        achievement: "Fiscal Deficit Consolidation Glide Path",
        outlay: "4.9% of GDP Target in FY25",
        status: "Brought down fiscal deficit from COVID peak of 9.2% of GDP while maintaining macroeconomic stability."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 89,
      integrityAndCleanGovernance: 94,
      policyCompetence: 86,
      publicResponsiveness: 65,
      overallScore: 83
    },
    performanceScore: 83
  },

  "yogi-adityanath": {
    name: "Yogi Adityanath",
    slug: "yogi-adityanath",
    title: "Chief Minister of Uttar Pradesh",
    currentPosition: "Chief Minister of Uttar Pradesh (2nd Consecutive Term since 2017), MLA for Gorakhpur Urban, Head Priest of Gorakhnath Math",
    ministry: "Uttar Pradesh — Home, Vigilance, Housing, General Administration",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Yogi_Adityanath_in_2023.jpg/800px-Yogi_Adityanath_in_2023.jpg",
    education: "BSc Mathematics (Hemwati Nandan Bahuguna Garhwal University, Srinagar, Uttarakhand)",
    educationDetails: {
      degree: "Bachelor of Science (BSc) in Mathematics",
      institution: "Hemwati Nandan Bahuguna Garhwal University, Srinagar, Uttarakhand (1992)",
      summary: "Completed BSc in Mathematics from HNB Garhwal University before taking monk vows under Mahant Avaidyanath at Gorakhnath Math."
    },
    declaredAssetsCr: 1.54,
    totalAssetsCr: 1.54,
    liabilitiesCr: 0.0,
    assetGrowthPct: 8,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Past political protest cases withdrawn under CrPC Section 321 state government gazette notification in 2017-18.",
    constituency: "Gorakhpur Urban, Uttar Pradesh",
    stateName: "Uttar Pradesh",
    stateCode: "UP",
    isCM: true,
    scamsAndCorruption: [
      {
        title: "Recruitment Exam Paper Leaks (UP Police & RO/ARO 2024)",
        financialImpact: "48 Lakh Aspirants Impacted",
        description: "Paper leaks in UP Police Constable exam (48 lakh applicants) and RO/ARO exam forced cancellation, arrest of 300+ solver gang members, and enactment of UP Anti-Paper Leak Act.",
        status: "Strict Anti-Paper Leak Act Enacted"
      }
    ],
    epicFailures: [
      {
        achievement: "Hathras Incident Administrative Response (2020)",
        outlay: "Supreme Court Scrutiny",
        status: "Criticism over late-night cremation and barricading of victim's family, prompting CBI probe and departmental suspensions."
      } as any,
      {
        achievement: "Stray Cattle & Rural Crop Damage Crisis",
        outlay: "12+ Lakh Stray Cattle in Shelters",
        status: "Enforcement of cattle slaughter ban created an acute stray cattle crisis damaging rural standing crops across Bundelkhand and Purvanchal."
      } as any,
      {
        achievement: "Extra-Legal Demolitions ('Bulldozer Action')",
        outlay: "Supreme Court Directive (2024)",
        status: "Demolition of accused persons' residences without prior judicial notice struck down by Supreme Court of India with mandatory pan-India guidelines."
      } as any
    ] as any,
    controversies: [
      "190+ encounter killings under 'Operation Langda' reviewed by NHRC and Supreme Court",
      "Strict enforcement of Anti-Conversion Law (Love Jihad) prosecutions",
      "Name-changing of historic cities (Allahabad to Prayagraj, Faizabad to Ayodhya)"
    ],
    keyWorks: [
      {
        achievement: "Expressway Capital of India (Purvanchal, Bundelkhand, Ganga)",
        outlay: "1,500+ km Expressway Grid",
        status: "Completed Purvanchal (341 km) and Bundelkhand (296 km) expressways; 594 km Ganga Expressway under fast-track completion."
      },
      {
        achievement: "Containment of Mafia Cartels & Organized Gangs",
        outlay: "₹3,800+ Cr Mafia Assets Seized",
        status: "Crushed organized extortion syndicates and seized illegal assets of organized crime bosses."
      },
      {
        achievement: "Cultural Infrastructure (Ayodhya Ram Mandir & Kashi Corridor)",
        outlay: "5x Surge in Tourism Revenue",
        status: "Transformed religious tourism economy with 32+ crore tourist footfalls in 2023-24."
      },
      {
        achievement: "UP Global Investors Summit (GIS)",
        outlay: "₹10+ Lakh Cr Grounded Projects",
        status: "Attracted mega data centers, mobile manufacturing (Noida), and Defense Industrial Corridor manufacturing nodes."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 88,
      integrityAndCleanGovernance: 82,
      policyCompetence: 58,
      publicResponsiveness: 66,
      overallScore: 79
    },
    performanceScore: 79
  },

  "arvind-kejriwal": {
    name: "Arvind Kejriwal",
    slug: "arvind-kejriwal",
    title: "National Convener of AAP / Former CM of Delhi",
    currentPosition: "National Convener of Aam Aadmi Party (AAP), Former Chief Minister of Delhi (2013, 2015-2024)",
    ministry: "Aam Aadmi Party National Leadership",
    party: "Aam Aadmi Party (AAP)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Arvind_Kejriwal_in_2023.jpg/800px-Arvind_Kejriwal_in_2023.jpg",
    education: "B.Tech Mechanical Engineering (IIT Kharagpur, 1989); Former Indian Revenue Service (IRS) Officer",
    educationDetails: {
      degree: "Bachelor of Technology (B.Tech) in Mechanical Engineering",
      institution: "Indian Institute of Technology (IIT) Kharagpur (1989)",
      summary: "Graduated from IIT Kharagpur in 1989; joined Tata Steel; cleared UPSC Civil Services and served as Joint Commissioner in the Indian Revenue Service (IRS)."
    },
    declaredAssetsCr: 3.44,
    totalAssetsCr: 3.44,
    liabilitiesCr: 0.0,
    assetGrowthPct: 4,
    criminalCases: 13,
    seriousCriminalCases: 4,
    criminalCaseNote: "Arrested by ED and CBI in Delhi Excise Policy investigation in March 2024; granted regular bail by Supreme Court of India in Sept 2024.",
    constituency: "New Delhi Assembly, Delhi",
    stateName: "Delhi",
    stateCode: "DL",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "Delhi Excise Policy Liquor Scam (2021-22)",
        financialImpact: "₹100+ Crore Kickback Probe",
        description: "ED and CBI alleged that scrapped 2021-22 liquor policy provided 12% profit margins to private wholesalers in exchange for kickbacks used in Goa election campaign; CM Kejriwal and Dy CM Manish Sisodia spent months in Tihar jail before Supreme Court granted bail.",
        status: "ED / CBI Trial & Supreme Court Bail"
      },
      {
        title: "'Sheesh Mahal' CM Residence Renovation Controversy",
        financialImpact: "₹45+ Crore Renovation Expenditure",
        description: "Vigilance Directorate and CAG audit into expenditure of ₹45+ Crore on official 6 Flagstaff Road bungalow renovation during COVID-19 pandemic without formal CPWD tender approvals.",
        status: "Vigilance Inquiry"
      }
    ],
    epicFailures: [
      {
        achievement: "Delhi Winter Air Pollution & Smog Crisis",
        outlay: "AQI Exceeding 450+ Annually",
        status: "Persistent severe air pollution crisis every winter; inability to eliminate farm stubble burning in neighboring states despite AAP governance in Punjab."
      } as any,
      {
        achievement: "Yamuna River Cleanliness Failure",
        outlay: "₹6,800 Cr Expenditure",
        status: "Failure to eliminate industrial foam and sewage inflow into Yamuna despite repeated election manifestos promising clean bathing by 2025."
      } as any,
      {
        achievement: "Swati Maliwal Assault Controversy (2024)",
        outlay: "Party Crisis",
        status: "Rajya Sabha MP Swati Maliwal alleged physical assault inside the CM official residence by personal assistant Bibhav Kumar."
      } as any
    ] as any,
    controversies: [
      "Prolonged institutional friction with Lieutenant Governor (LG) of Delhi over executive transfer postings (GNCTD Act)",
      "Delhi Jal Board financial deficit swelling past ₹73,000 Crore",
      "Defamation cases filed by various political figures (apologies tendered in courts)"
    ],
    keyWorks: [
      {
        achievement: "Delhi Public School Education Model",
        outlay: "25% of State Budget Allocated",
        status: "Transformed government schools with swimming pools, smart classrooms, and Mega PTMs, reaching 96%+ CBSE board pass rates."
      },
      {
        achievement: "Mohalla Clinics Primary Healthcare Network",
        outlay: "520+ Neighborhood Clinics",
        status: "Provided free doctor consultations, 212 lab diagnostic tests, and generic medicines to 2+ crore patients annually."
      },
      {
        achievement: "200 Units Free Electricity & Free Water",
        outlay: "Zero Power Bills for 45 Lakh Households",
        status: "Subsidized basic utilities for low- and middle-income households while maintaining a revenue-surplus state budget until 2023."
      },
      {
        achievement: "Free DTC Bus Travel for Women",
        outlay: "Pink Pass Scheme",
        status: "Boosted female public transit ridership from 25% to 43% across the Delhi transit network."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 86,
      integrityAndCleanGovernance: 45,
      policyCompetence: 92,
      publicResponsiveness: 52,
      overallScore: 68
    },
    performanceScore: 68
  },

  "rahul-gandhi": {
    name: "Rahul Gandhi",
    slug: "rahul-gandhi",
    title: "Leader of the Opposition (Lok Sabha)",
    currentPosition: "Leader of the Opposition (LoP) in the 18th Lok Sabha, MP for Rae Bareli, Former President of the Indian National Congress",
    ministry: "Parliament of India — Leader of the Opposition",
    party: "Indian National Congress (INC)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rahul_Gandhi_in_2023.jpg/800px-Rahul_Gandhi_in_2023.jpg",
    education: "MPhil Development Studies (Trinity College, Cambridge, 1995); BA (Rollins College, Florida, 1994)",
    educationDetails: {
      degree: "Master of Philosophy (MPhil) in Development Studies",
      institution: "Trinity College, Cambridge (1995) & Rollins College, Florida (1994)",
      summary: "Attended St. Stephen's College, Delhi, and Harvard University before transferring to Rollins College (BA, 1994); earned MPhil in Development Studies from Trinity College, Cambridge under pseudonym 'Raul Vinci' for security reasons."
    },
    declaredAssetsCr: 20.4,
    totalAssetsCr: 20.4,
    liabilitiesCr: 0.5,
    assetGrowthPct: 28,
    criminalCases: 8,
    seriousCriminalCases: 2,
    criminalCaseNote: "Defamation cases and political demonstration charges; Surat Court defamation conviction stayed by Supreme Court in 2023, restoring Parliamentary membership.",
    constituency: "Rae Bareli, Uttar Pradesh",
    scamsAndCorruption: [
      {
        title: "National Herald / Young Indian Investigation",
        financialImpact: "₹2,000+ Crore Property Assets",
        description: "ED and IT investigation into transfer of Associated Journals Ltd (AJL) commercial assets to non-profit Young Indian Pvt Ltd; Sonia Gandhi and Rahul Gandhi interrogated by ED.",
        status: "Trial Court Hearing & ED Scrutiny"
      }
    ],
    epicFailures: [
      {
        achievement: "2014 & 2019 Consecutive General Election Defeats",
        outlay: "Congress Reduced to 44 & 52 Seats",
        status: "Inability to mount an effective electoral challenge against NDA for a decade, resulting in resignation from Congress party presidency in 2019."
      } as any,
      {
        achievement: "Public Tearing of 2013 Convicted Lawmakers Ordinance",
        outlay: "Undermining UPA PM Manmohan Singh",
        status: "Publicly denounced and tore up his own government's ordinance protecting convicted lawmakers, causing severe embarrassment to Prime Minister Manmohan Singh."
      } as any
    ] as any,
    controversies: [
      "Defamation conviction and temporary disqualification from Lok Sabha over 'Modi surname' remark",
      "Overseas speeches (Cambridge, London, US) regarding Indian democracy and institutions",
      "Allegations regarding Rafale fighter jet deal ('Chowkidar Chor Hai' campaign)"
    ],
    keyWorks: [
      {
        achievement: "Bharat Jodo Yatra (4,000 km Kanyakumari to Kashmir)",
        outlay: "145 Days Mass Foot March",
        status: "Re-energized grassroots party cadres and shifted national discourse around harmony, unemployment, and constitutional protections."
      },
      {
        achievement: "Revival of INDIA Bloc in 2024 General Elections",
        outlay: "234 Opposition Seats",
        status: "United 26 opposition parties, restored Congress to 99 seats, and assumed constitutional office of Leader of the Opposition (LoP)."
      },
      {
        achievement: "Advocacy for Caste Census & Legal MSP Guarantee",
        outlay: "National Policy Agenda",
        status: "Successfully made caste-based census, removal of 50% reservation cap, and legal MSP central national political themes."
      },
      {
        achievement: "MGNREGA & Right to Fair Land Compensation (2013)",
        outlay: "Historic Rights-Based Enactments",
        status: "Championed 2013 Land Acquisition Act (LARR) ensuring 4x market compensation for rural farmers."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 60,
      integrityAndCleanGovernance: 82,
      policyCompetence: 84,
      publicResponsiveness: 85,
      overallScore: 74
    },
    performanceScore: 74
  }
};

export const PM_PROFILE: MinisterProfile = {
  ...(ministersJson[0] || {}),
  ...COMPREHENSIVE_LEADERS["narendra-modi"]
} as MinisterProfile;

export const MINISTERS: MinisterProfile[] = (ministersJson.slice(1) || []).map((m: any) => {
  const slug = m.slug || nameToSlug(m.name || "");
  const enriched = COMPREHENSIVE_LEADERS[slug];
  if (enriched) {
    return { ...m, ...enriched };
  }
  return {
    ...m,
    slug,
    photoUrl: m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || "Leader")}&background=06038D&color=fff&size=256`,
    currentPosition: m.currentPosition || `${m.title || "Cabinet Minister"} (${m.ministry || "Union Government"})`,
    workScoreBreakdown: {
      schemeDelivery: 82,
      integrityAndCleanGovernance: Math.max(50, 90 - (m.criminalCases || 0) * 5),
      policyCompetence: 80,
      publicResponsiveness: 75,
      overallScore: m.performanceScore || Math.max(65, 85 - (m.criminalCases || 0) * 3)
    }
  };
}) as MinisterProfile[];
