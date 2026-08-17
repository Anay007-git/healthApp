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

export const LEADER_PHOTOS: Record<string, string> = {
  "narendra-modi": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/The_official_portrait_of_Shri_Narendra_Modi%2C_the_Prime_Minister_of_the_Republic_of_India.jpg/330px-The_official_portrait_of_Shri_Narendra_Modi%2C_the_Prime_Minister_of_the_Republic_of_India.jpg",
  "amit-shah": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Shri_Amit_Shah_in_Raigad.jpg/330px-Shri_Amit_Shah_in_Raigad.jpg",
  "nitin-gadkari": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nitin_Jairam_Gadkari.jpg/330px-Nitin_Jairam_Gadkari.jpg",
  "nirmala-sitharaman": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Am_11._April_2025_empfing_Au%C3%9Fenministerin_Beate_Meinl-Reisinger_die_indische_Finanzministerin_Nirmala_Sitharaman_in_Wien_%2854445397025%29_%28cropped%29.jpg/330px-Am_11._April_2025_empfing_Au%C3%9Fenministerin_Beate_Meinl-Reisinger_die_indische_Finanzministerin_Nirmala_Sitharaman_in_Wien_%2854445397025%29_%28cropped%29.jpg",
  "rajnath-singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shri_Rajnath_Singh%2C_in_New_Delhi_on_May_09%2C_2023_%28cropped%29.jpg/330px-Shri_Rajnath_Singh%2C_in_New_Delhi_on_May_09%2C_2023_%28cropped%29.jpg",
  "s-jaishankar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/The_official_portrait_of_External_Minister_Subrahmanyam_Jaishankar.jpg/330px-The_official_portrait_of_External_Minister_Subrahmanyam_Jaishankar.jpg",
  "j-p-nadda": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Jagat_Prakash_Nadda_2023.jpg/330px-Jagat_Prakash_Nadda_2023.jpg",
  "rahul-gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rahul_Gandhi.png/330px-Rahul_Gandhi.png",
  "arvind-kejriwal": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Arvind_Kejriwal_2022_Official_Portrail_%28AI_enhanced%29.jpg/330px-Arvind_Kejriwal_2022_Official_Portrail_%28AI_enhanced%29.jpg",
  "yogi-adityanath": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yogiji_in_2023.jpg/330px-Yogiji_in_2023.jpg",
  "mamata-banerjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ms._Mamata_Banerjee%2C_in_Kolkata_on_July_17%2C_2018_%28cropped%29.JPG/330px-Ms._Mamata_Banerjee%2C_in_Kolkata_on_July_17%2C_2018_%28cropped%29.JPG",
  "suvendu-adhikari": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Suvendu_Adhikari_May_2026_%28cropped%29.jpg/330px-Suvendu_Adhikari_May_2026_%28cropped%29.jpg",
  "mk-stalin": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/The_Chief_Minister_of_Tamil_Nadu%2C_Thiru_MK_Stalin.jpg/330px-The_Chief_Minister_of_Tamil_Nadu%2C_Thiru_MK_Stalin.jpg",
  "siddaramaiah": "https://upload.wikimedia.org/wikipedia/commons/0/06/Siddaramaiah_at_the_function_Akshaya_Patra_Foundation_in_Karnataka.jpg",
  "eknath-shinde": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Eknath_Shinde_SS.jpg/330px-Eknath_Shinde_SS.jpg",
  "devendra-fadnavis": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Shri_Devendra_Gangadharrao_Fadnavis.jpg/330px-Shri_Devendra_Gangadharrao_Fadnavis.jpg",
  "nitish-kumar": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Nitish_Kumar_August_2026.jpg/330px-Nitish_Kumar_August_2026.jpg",
  "piyush-goyal": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Piyush_Goyal_crop.jpg/330px-Piyush_Goyal_crop.jpg",
  "dharmendra-pradhan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Dharmendra_Pradhan%2C_Minister_of_Education.jpg/330px-Dharmendra_Pradhan%2C_Minister_of_Education.jpg",
  "ashwini-vaishnaw": "https://upload.wikimedia.org/wikipedia/commons/3/35/Ashwini_Vaishnaw_cropped.jpg",
  "jyotiraditya-scindia": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/H20250428182531.jpg/330px-H20250428182531.jpg",
  "bhupender-yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Union_Minister_Bhupender_Yadav.jpg/330px-Union_Minister_Bhupender_Yadav.jpg",
  "kiren-rijiju": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Kiren_Rijiju_with_Modi_%28cropped%29.jpg/330px-Kiren_Rijiju_with_Modi_%28cropped%29.jpg",
  "hardeep-singh-puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Hardeep_Singh_Puri_with_PM_Modi_%28cropped%29.jpg/330px-Hardeep_Singh_Puri_with_PM_Modi_%28cropped%29.jpg",
  "chirag-paswan": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/The_Union_Minister_of_Food_Processing_Industries%2C_Shri_Chirag_Paswan_chaired_a_Curtain_Raiser_Press_Conference_on_%E2%80%9CWorld_Food_India-2024%E2%80%9D_%E2%80%93_in_New_Delhi_on_June_19%2C_2024_%28Cropped%29.jpg/330px-thumbnail.jpg",
  "shivraj-singh-chouhan": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Shivraj_Singh_Chouhan_2025.jpg/330px-Shivraj_Singh_Chouhan_2025.jpg",
  "jitan-ram-manjhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jitan_Ram_Manjhi_June_2024_cropped.jpg/330px-Jitan_Ram_Manjhi_June_2024_cropped.jpg",
  "rajiv-ranjan-singh": "https://upload.wikimedia.org/wikipedia/commons/3/36/Shri_Rajiv_Ranjan_Singh_alias_Lalan_Singh_interacting_with_media_after_taking_charge_as_the_Union_Minister_for_Fisheries%2C_Animal_Husbandry_and_Dairying.jpg",
  "sarbananda-sonowal": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sarbananda_Sonowal_with_PM_Modi_%28cropped%29.jpg/330px-Sarbananda_Sonowal_with_PM_Modi_%28cropped%29.jpg",
  "dr-virendra-kumar": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Virendra_Kumar_Khatik_with_PM_Modi_%28cropped%29.jpg/330px-Virendra_Kumar_Khatik_with_PM_Modi_%28cropped%29.jpg",
  "kinjarapu-ram-mohan-naidu": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kinjarapu_Ram_Mohan_Naidu_%28cropped%29.jpg/330px-Kinjarapu_Ram_Mohan_Naidu_%28cropped%29.jpg",
  "pralhad-joshi": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Pralhad_Joshi_in_2024.jpg/330px-Pralhad_Joshi_in_2024.jpg",
  "jual-oram": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Jual_Oram_Tribal_Affairs_Minister.jpg/330px-Jual_Oram_Tribal_Affairs_Minister.jpg",
  "giriraj-singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Giriraj_Singh_addressing_at_the_inauguration_of_the_National_Conclave_%28MSME_Udyam_Sangam_2018%29%2C_on_the_occasion_of_the_2nd_United_Nations_MSME_Day%2C_in_New_Delhi.JPG/330px-thumbnail.jpg",
  "gajendra-singh-shekhawat": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/The_Union_Minister_of_Culture_and_Tourism%2C_Shri_Gajendra_Singh_Shekhawat_addressing_at_the_inauguration_of_the_7th_Edition_of_the_International_Hospitality_Expo._2024_at_Greater_Noida%2C_in_Uttar_Pradesh_on_August_03%2C_2024_%28cropped%29.jpg/330px-thumbnail.jpg",
  "annapurna-devi": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Annpurna_Devi_Minister_%28cropped%29.jpg/330px-Annpurna_Devi_Minister_%28cropped%29.jpg",
  "dr-mansukh-mandaviya": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Mansukh_Mandaviya_photo_2.png/330px-Mansukh_Mandaviya_photo_2.png",
  "g-kishan-reddy": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/G._Kishan_Reddy_in_2025.jpg/330px-G._Kishan_Reddy_in_2025.jpg",
  "c-r-patil": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/The_Union_Minister_for_Jal_Shakti%2C_Shri_C.R._Paatil_addressing_at_the_Jal_Shakti_Abhiyan-_Catch_the_Rain_Programme%2C_in_New_Delhi_on_June_24%2C_2024_%28cropped%29.jpg/330px-The_Union_Minister_for_Jal_Shakti%2C_Shri_C.R._Paatil_addressing_at_the_Jal_Shakti_Abhiyan-_Catch_the_Rain_Programme%2C_in_New_Delhi_on_June_24%2C_2024_%28cropped%29.jpg",
  "h-d-kumaraswamy": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/JDS_chief_Kumaraswamy.jpg/330px-JDS_chief_Kumaraswamy.jpg",
  "manohar-lal-khattar": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Manohar_Lal%2C_Minister_of_Power.jpg/330px-Manohar_Lal%2C_Minister_of_Power.jpg",
  "himanta-biswa-sarma": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Himanta_Biswa_Sarma_in_2026.jpg/330px-Himanta_Biswa_Sarma_in_2026.jpg",
  "bhagwant-mann": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Bhagwant_Mann_2026.jpg/330px-Bhagwant_Mann_2026.jpg",
  "pinarayi-vijayan": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Chief_Minister_Pinarayi_Vijayan_2023.jpg/330px-Chief_Minister_Pinarayi_Vijayan_2023.jpg",
  "pushkar-singh-dhami": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Pushkar_Singh_Dhami%2C_Chief_Minister_of_Uttarakhand.jpg/330px-Pushkar_Singh_Dhami%2C_Chief_Minister_of_Uttarakhand.jpg",
  "hemant-soren": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Hemant_Soren_01.jpg/330px-Hemant_Soren_01.jpg",
  "mohan-yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mohan_Yadav%2C_Chief_Minister_of_Madhya_Pradesh.jpg/330px-Mohan_Yadav%2C_Chief_Minister_of_Madhya_Pradesh.jpg",
  "bhupendra-patel": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bhupendra_Patel_%28cropped%29.jpg",
  "pramod-sawant": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pramod_Sawant_at_the_inauguration_of_the_Chhatrapati_Shivaji_Maharaj_Chair_in_Goa_University_%28cropped%29.jpg/330px-Pramod_Sawant_at_the_inauguration_of_the_Chhatrapati_Shivaji_Maharaj_Chair_in_Goa_University_%28cropped%29.jpg",
  "revanth-reddy": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Portrait_of_Telangana_CM_Revanth_Reddy.png/330px-Portrait_of_Telangana_CM_Revanth_Reddy.png",
  "n-chandrababu-naidu": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/The_portrait_of_CM_Shri_Nara_Chandrababu_Naidu.jpg/330px-The_portrait_of_CM_Shri_Nara_Chandrababu_Naidu.jpg",
  "abhishek-banerjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Abhishek_Banerjee_MP_photo.jpg/330px-Abhishek_Banerjee_MP_photo.jpg",
  "akhilesh-yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Akhilesh_Yadav_official_portrait_2024.jpg/330px-Akhilesh_Yadav_official_portrait_2024.jpg",
  "mahua-moitra": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mahua_Moitra_2023.jpg/330px-Mahua_Moitra_2023.jpg",
  "tejashwi-yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Tejashwi_Yadav_in_2023.jpg/330px-Tejashwi_Yadav_in_2023.jpg",
  "shashi-tharoor": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Shashi_Tharoor_in_2023.jpg/330px-Shashi_Tharoor_in_2023.jpg",
  "asaduddin-owaisi": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Asaduddin_Owaisi_in_2024.jpg/330px-Asaduddin_Owaisi_in_2024.jpg"
};

export const COMPREHENSIVE_LEADERS: Record<string, Partial<MinisterProfile>> = {
  "mamata-banerjee": {
    name: "Mamata Banerjee",
    slug: "mamata-banerjee",
    title: "Former Chief Minister of West Bengal / Chairperson of AITC",
    currentPosition: "Former Chief Minister of West Bengal (3 Consecutive Terms, 2011–2026), Chairperson of All India Trinamool Congress (AITC), MLA for Bhabanipur",
    ministry: "All India Trinamool Congress (AITC) Leadership",
    party: "All India Trinamool Congress (AITC)",
    photoUrl: LEADER_PHOTOS["mamata-banerjee"],
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
    isCM: false,
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
    photoUrl: LEADER_PHOTOS["narendra-modi"],
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
    photoUrl: LEADER_PHOTOS["amit-shah"],
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
    photoUrl: LEADER_PHOTOS["nitin-gadkari"],
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
    photoUrl: LEADER_PHOTOS["nirmala-sitharaman"],
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

  "rajnath-singh": {
    name: "Rajnath Singh",
    slug: "rajnath-singh",
    title: "Union Minister of Defence",
    currentPosition: "Union Minister of Defence, Government of India (MP for Lucknow), Former Chief Minister of Uttar Pradesh",
    ministry: "Ministry of Defence",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: LEADER_PHOTOS["rajnath-singh"],
    education: "MSc Physics (Gorakhpur University)",
    educationDetails: {
      degree: "Master of Science (MSc) in Physics",
      institution: "Gorakhpur University, Uttar Pradesh",
      summary: "Graduated with MSc in Physics; worked as physics lecturer at K.B. Post-Graduate College, Mirzapur before joining full-time public life."
    },
    declaredAssetsCr: 18.7,
    totalAssetsCr: 18.7,
    liabilitiesCr: 0.0,
    assetGrowthPct: 15,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal cases declared across all Parliamentary affidavits.",
    constituency: "Lucknow, Uttar Pradesh",
    scamsAndCorruption: [
      {
        title: "Zero Personal Irregularity Inquiries",
        financialImpact: "₹0 Cr Loss",
        description: "Zero corruption charges or financial impropriety findings on public record.",
        status: "Impeccable Record"
      }
    ],
    epicFailures: [
      {
        achievement: "Agnipath Scheme Protests (2022)",
        outlay: "Short-Service Defense Recruitment",
        status: "Nationwide youth protests and train disruptions following announcement of 4-year contractual soldier recruitment."
      } as any
    ] as any,
    controversies: [
      "Eastern Ladakh LAC border disengagement timelines and buffer zones with China",
      "Defense capital budget modernization and indigenization transition speeds"
    ],
    keyWorks: [
      {
        achievement: "Indigenous Defense Manufacturing & Exports",
        outlay: "₹21,083 Cr Defense Exports FY24",
        status: "Elevated Indian defense manufacturing value to ₹1.27 Lakh Crore with exports to 90+ countries."
      },
      {
        achievement: "Border Roads Infrastructure Expansion",
        outlay: "BRO High-Altitude Passes & Tunnels",
        status: "Constructed Sela Tunnel, Atal Tunnel connectivity corridors, and all-weather LAC operational roads."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 88,
      integrityAndCleanGovernance: 92,
      policyCompetence: 84,
      publicResponsiveness: 76,
      overallScore: 85
    },
    performanceScore: 85
  },

  "s-jaishankar": {
    name: "Dr. S. Jaishankar",
    slug: "s-jaishankar",
    title: "Union Minister of External Affairs",
    currentPosition: "Union Minister of External Affairs, Government of India (Rajya Sabha MP for Gujarat), Former Foreign Secretary of India",
    ministry: "Ministry of External Affairs (MEA)",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: LEADER_PHOTOS["s-jaishankar"],
    education: "PhD & MPhil International Relations (JNU); MA Political Science (JNU); BSc Chemistry (St. Stephen's College)",
    educationDetails: {
      degree: "PhD in International Relations",
      institution: "Jawaharlal Nehru University (JNU) & St. Stephen's College, Delhi",
      summary: "Graduated with BSc from St. Stephen's; earned MA, MPhil, and PhD in International Relations specializing in nuclear diplomacy from JNU."
    },
    declaredAssetsCr: 14.2,
    totalAssetsCr: 14.2,
    liabilitiesCr: 0.0,
    assetGrowthPct: 10,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal cases declared across all affidavits.",
    constituency: "Rajya Sabha, Gujarat",
    scamsAndCorruption: [
      {
        title: "Zero Financial Irregularities",
        financialImpact: "₹0 Cr Loss",
        description: "Zero corruption inquiries or legal irregularities on record.",
        status: "Clean Integrity Track Record"
      }
    ],
    epicFailures: [
      {
        achievement: "Maldives Diplomatic Strain & Troop Withdrawal (2023-24)",
        outlay: "Indian Ocean Island Diplomacy",
        status: "Diplomatic friction following 'India Out' campaign in Male, requiring renegotiated civilian aviation technician arrangements."
      } as any
    ] as any,
    controversies: [
      "Strategic autonomy positioning and discounted Russian crude oil purchases amid Western sanctions",
      "Diplomatic standoff with Canada over Khalistani extremist network allegations"
    ],
    keyWorks: [
      {
        achievement: "G20 New Delhi Leaders' Declaration Consensus (2023)",
        outlay: "Historic Global Consensus",
        status: "Secured 100% unanimous consensus declaration and inducted 55-nation African Union into permanent G20 membership."
      },
      {
        achievement: "Global Citizen Evacuation Missions (Operation Ganga, Kaveri, Ajay)",
        outlay: "30,000+ Citizens Rescued",
        status: "Successfully evacuated Indian students and diaspora from active combat zones in Ukraine, Sudan, and Israel."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 92,
      integrityAndCleanGovernance: 95,
      policyCompetence: 94,
      publicResponsiveness: 80,
      overallScore: 90
    },
    performanceScore: 90
  },

  "j-p-nadda": {
    name: "J.P. Nadda",
    slug: "j-p-nadda",
    title: "Union Minister of Health & Family Welfare · Chemicals & Fertilizers",
    currentPosition: "Union Minister of Health and Family Welfare and Minister of Chemicals and Fertilizers, Government of India (Rajya Sabha MP for Gujarat), National President of BJP",
    ministry: "Ministry of Health & Family Welfare · Ministry of Chemicals & Fertilizers",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: LEADER_PHOTOS["j-p-nadda"],
    education: "LLB (Himachal Pradesh University, Shimla); BA (Patna College)",
    educationDetails: {
      degree: "Bachelor of Laws (LLB)",
      institution: "Himachal Pradesh University & Patna University",
      summary: "Graduated with BA from Patna College and completed LLB law degree from Himachal Pradesh University, Shimla."
    },
    declaredAssetsCr: 25.8,
    totalAssetsCr: 25.8,
    liabilitiesCr: 0.0,
    assetGrowthPct: 20,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal cases declared in affidavits.",
    constituency: "Rajya Sabha, Gujarat",
    scamsAndCorruption: [
      {
        title: "Zero Personal Irregularities",
        financialImpact: "₹0 Cr Loss",
        description: "Zero corruption charges or adverse CAG findings.",
        status: "Clean Public Record"
      }
    ],
    epicFailures: [
      {
        achievement: "National Medical Commission (NMC) NEET-UG Paper Leak Crisis (2024)",
        outlay: "23 Lakh Medical Candidates Affected",
        status: "Widespread irregularities and paper leaks in NEET-UG 2024 triggering Supreme Court hearings and CBI arrests."
      } as any
    ] as any,
    controversies: [
      "NEET-PG examination postponement controversies and counseling delays",
      "Pharmaceutical quality control audits and spurious drug export recalls"
    ],
    keyWorks: [
      {
        achievement: "Ayushman Bharat PM-JAY Senior Citizen Universal Expansion (70+ Years)",
        outlay: "6 Crore Senior Citizens",
        status: "Rolled out unconditional ₹5 Lakh/year health cover to all senior citizens aged 70 and above regardless of income."
      },
      {
        achievement: "Establishment of 22 New AIIMS Super-Specialty Institutes",
        outlay: "₹30,000+ Crore Infrastructure",
        status: "Expanded nationwide tertiary super-specialty hospital capacity with operational AIIMS in Bilaspur, Gorakhpur, Rajkot, etc."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 85,
      integrityAndCleanGovernance: 86,
      policyCompetence: 80,
      publicResponsiveness: 72,
      overallScore: 81
    },
    performanceScore: 81
  },

  "yogi-adityanath": {
    name: "Yogi Adityanath",
    slug: "yogi-adityanath",
    title: "Chief Minister of Uttar Pradesh",
    currentPosition: "Chief Minister of Uttar Pradesh (2nd Consecutive Term since 2017), MLA for Gorakhpur Urban, Head Priest of Gorakhnath Math",
    ministry: "Uttar Pradesh — Home, Vigilance, Housing, General Administration",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: LEADER_PHOTOS["yogi-adityanath"],
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
    photoUrl: LEADER_PHOTOS["arvind-kejriwal"],
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
    photoUrl: LEADER_PHOTOS["rahul-gandhi"],
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
  },

  "suvendu-adhikari": {
    name: "Suvendu Adhikari",
    slug: "suvendu-adhikari",
    title: "Chief Minister of West Bengal",
    currentPosition: "Chief Minister of West Bengal (since May 2026), MLA for Nandigram; Former Minister for Transport, Irrigation and Water Resources in Government of West Bengal",
    ministry: "Government of West Bengal — Home, General Administration, Cabinet Affairs",
    party: "Bharatiya Janata Party (BJP)",
    photoUrl: LEADER_PHOTOS["suvendu-adhikari"],
    education: "MA Political Science (Rabindra Bharati University, Kolkata); BA (Calcutta University)",
    educationDetails: {
      degree: "Master of Arts (MA) in Political Science",
      institution: "Rabindra Bharati University, Kolkata & Calcutta University",
      summary: "Graduated with BA from Calcutta University; obtained MA in Political Science from Rabindra Bharati University, Kolkata."
    },
    declaredAssetsCr: 1.25,
    totalAssetsCr: 1.25,
    liabilitiesCr: 0.0,
    assetGrowthPct: 15,
    criminalCases: 3,
    seriousCriminalCases: 1,
    criminalCaseNote: "Declared pending political cases related to public protests and Nandigram election disputes in ECI Form 26 filings.",
    constituency: "Nandigram, Purba Medinipur, West Bengal",
    stateName: "West Bengal",
    stateCode: "WB",
    isCM: true,
    scamsAndCorruption: [
      {
        title: "Narada Sting Operation Footage Probe",
        financialImpact: "Sting Investigation",
        description: "Appeared in 2016 Narada news sting video purportedly receiving cash on camera during his tenure as TMC MP; probed by CBI and ED.",
        status: "CBI Investigation Ongoing / High Court Monitored"
      },
      {
        title: "Saradha Chit Fund Probes (Opposition Allegations)",
        financialImpact: "₹2,500+ Crore Fraud Inquiry",
        description: "Named in allegations and counter-petitions by arrested Ponzi masterminds regarding regional transport patronage; summoned and questioned.",
        status: "Covered under CBI Central Investigation"
      }
    ],
    epicFailures: [
      {
        achievement: "Nandigram Electoral Recounting Dispute (2021)",
        outlay: "Calcutta High Court Election Petition",
        status: "Narrow victory margin of 1,956 votes against sitting CM Mamata Banerjee challenged in Calcutta High Court alleging EVM counting and returning officer discrepancies."
      } as any,
      {
        achievement: "BJP Lok Sabha Bengal Tally Reduction (2024)",
        outlay: "Seats Dropped from 18 to 12 in 2024",
        status: "Despite aggressive state opposition campaigns, BJP's Bengal parliamentary tally declined from 18 seats in 2019 to 12 seats in 2024."
      } as any
    ] as any,
    controversies: [
      "Frequent assembly suspensions and walkouts during state budget sessions",
      "Defection from Trinamool Congress to BJP ahead of 2021 assembly elections"
    ],
    keyWorks: [
      {
        achievement: "Nandigram Anti-Land Acquisition Agitation (2007)",
        outlay: "Historic Agrarian Mobilization",
        status: "Led grassroots resistance against chemical SEZ land acquisition in Nandigram that fundamentally reshaped Bengal's political landscape."
      },
      {
        achievement: "Modernization of State Transport Undertakings (2016-2020)",
        outlay: "Electric & CNG Bus Fleet Rollout",
        status: "Introduced smart ticketing, electric bus routes in Kolkata metropolitan area, and revitalized inland water ferry systems as State Transport Minister."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 75,
      integrityAndCleanGovernance: 65,
      policyCompetence: 72,
      publicResponsiveness: 80,
      overallScore: 73
    },
    performanceScore: 73
  },



  "mk-stalin": {
    name: "M. K. Stalin",
    slug: "mk-stalin",
    title: "Chief Minister of Tamil Nadu",
    currentPosition: "Chief Minister of Tamil Nadu (since May 2021), President of Dravida Munnetra Kazhagam (DMK), MLA for Kolathur",
    ministry: "Tamil Nadu — Public, Home, Police, IAS, Special Initiatives",
    party: "Dravida Munnetra Kazhagam (DMK)",
    photoUrl: LEADER_PHOTOS["mk-stalin"],
    education: "BA History (Presidency College, Chennai)",
    educationDetails: {
      degree: "Bachelor of Arts (BA) in History",
      institution: "Presidency College, Chennai (University of Madras, 1973)",
      summary: "Completed BA in History from historic Presidency College, Chennai."
    },
    declaredAssetsCr: 8.89,
    totalAssetsCr: 8.89,
    liabilitiesCr: 0.0,
    assetGrowthPct: 49,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "No active personal criminal convictions declared in certified ECI filings.",
    constituency: "Kolathur, Chennai, Tamil Nadu",
    stateName: "Tamil Nadu",
    stateCode: "TN",
    isCM: true,
    scamsAndCorruption: [
      {
        title: "TASMAC Liquor Revenue & Licensing Inquiries",
        financialImpact: "State Distribution Audit",
        description: "Opposition AIADMK and BJP flagged allegations over liquor bottling contracts and bar licensing compliance under state-run TASMAC.",
        status: "State Assembly Scrutiny"
      }
    ],
    epicFailures: [
      {
        achievement: "Chennai Cyclone Michaung Flooding (Dec 2023)",
        outlay: "Urban Drainage Deficit",
        status: "Inundation of key residential localities in Chennai despite ₹4,000 Cr storm water drain projects."
      } as any
    ] as any,
    controversies: [
      "Clashes with Tamil Nadu Governor R.N. Ravi on bill assent timelines",
      "Stalin cabinet's call for eradication of Sanatana Dharma sparked national debate"
    ],
    keyWorks: [
      {
        achievement: "Kalaignar Magalir Urimai Thogai (₹1,000/mo)",
        outlay: "₹12,000 Cr / Year",
        status: "Direct monthly basic income transfer to 1.15 Crore women heads of families across Tamil Nadu."
      },
      {
        achievement: "Chief Minister's Free Breakfast Scheme for Primary Schools",
        outlay: "31,000+ Government Schools",
        status: "Provided nutritious hot breakfast to 17+ lakh primary school children, boosting school attendance by 20%."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 90,
      integrityAndCleanGovernance: 76,
      policyCompetence: 88,
      publicResponsiveness: 82,
      overallScore: 84
    },
    performanceScore: 84
  },
  "abhishek-banerjee": {
    name: "Abhishek Banerjee",
    slug: "abhishek-banerjee",
    title: "Member of Parliament (Lok Sabha) & National General Secretary of AITC",
    currentPosition: "Member of Parliament for Diamond Harbour (3rd Consecutive Term since 2014), National General Secretary of All India Trinamool Congress (AITC)",
    ministry: "Parliamentary Representation & AITC National Leadership",
    party: "All India Trinamool Congress (AITC)",
    photoUrl: LEADER_PHOTOS["abhishek-banerjee"],
    education: "BBA & MBA (Indian Institute of Planning and Management, New Delhi)",
    educationDetails: {
      degree: "Bachelor & Master of Business Administration (BBA, MBA)",
      institution: "Indian Institute of Planning and Management (IIPM), New Delhi",
      summary: "Earned undergraduate and postgraduate degrees in business management prior to entering parliamentary politics in 2014."
    },
    declaredAssetsCr: 1.52,
    totalAssetsCr: 1.52,
    liabilitiesCr: 0.0,
    assetGrowthPct: 14,
    criminalCases: 1,
    seriousCriminalCases: 0,
    criminalCaseNote: "Declared 1 pending political defamation/protest case in certified 2024 ECI Form 26 filing; questioned by ED in coal extraction and cattle transport investigations without trial court chargesheet to date.",
    constituency: "Diamond Harbour, South 24 Parganas, West Bengal",
    stateName: "West Bengal",
    stateCode: "WB",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "Coal Extraction & Smuggling PMLA Inquiry",
        financialImpact: "₹1,352 Crore Probe",
        description: "Enforcement Directorate and CBI registered PMLA inquiries regarding illegal coal extraction in Eastern Coalfields leasehold areas; questioned Abhishek Banerjee in New Delhi & Kolkata offices.",
        status: "ED Inquiries & Supreme Court Review"
      },
      {
        title: "Cattle Smuggling Financial Channel Inquiries",
        financialImpact: "Interstate Syndicate Investigation",
        description: "Central agencies probed bank accounts and administrative access regarding border transport networks; summoned for formal witness statements.",
        status: "Sub-judice Central Investigation"
      }
    ],
    epicFailures: [
      {
        achievement: "TMC Yuva Organization Friction (2018–2021)",
        outlay: "Internal Party Restructuring",
        status: "Factional disputes during structural overhaul of youth wing before 2021 assembly elections."
      } as any,
      {
        achievement: "Central Agency Protests & High Court Litigation",
        outlay: "Administrative Gridlock",
        status: "Prolonged legal tussles over summons jurisdiction between Calcutta High Court and Supreme Court."
      } as any
    ] as any,
    controversies: [
      "Target of relentless opposition rhetoric regarding party succession and dynastic politics",
      "Led high-voltage sit-in protests outside Raj Bhavan Kolkata over MGNREGA dues"
    ],
    keyWorks: [
      {
        achievement: "Diamond Harbour Health & Telemedicine Model",
        outlay: "₹180+ Crore Welfare Network",
        status: "Pioneered localized universal health screening, free medicines distribution, and Covid containment model across Diamond Harbour constituency."
      },
      {
        achievement: "Trinamool Naba Jowar Grassroots Campaign (2023)",
        outlay: "60-Day 4,000+ km State Outreach",
        status: "Conducted statewide outreach to select local rural panchayat election candidates via direct grassroots secret-ballot voting."
      },
      {
        achievement: "Parliamentary Voice for State Financial Allocations",
        outlay: "Lok Sabha Debates",
        status: "Consistently raised 100-day work MGNREGA and Awas Yojana central release demands in Lok Sabha floor debates."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 81,
      integrityAndCleanGovernance: 66,
      policyCompetence: 78,
      publicResponsiveness: 85,
      overallScore: 77
    },
    performanceScore: 77
  },
  "akhilesh-yadav": {
    name: "Akhilesh Yadav",
    slug: "akhilesh-yadav",
    title: "Member of Parliament (Lok Sabha) & President of Samajwadi Party",
    currentPosition: "Leader of Opposition in Lok Sabha, President of Samajwadi Party (SP), Former Chief Minister of Uttar Pradesh (2012–2017)",
    ministry: "Samajwadi Party National Leadership & Parliamentary Opposition",
    party: "Samajwadi Party (SP)",
    photoUrl: LEADER_PHOTOS["akhilesh-yadav"],
    education: "B.Tech Civil Environmental Engineering (JSS Academy, Mysore) & Master of Environmental Engineering (University of Sydney, Australia)",
    educationDetails: {
      degree: "B.Tech Civil Engineering & M.Eng Environmental Engineering",
      institution: "JSS Academy of Technical Education, Mysore & University of Sydney, Australia",
      summary: "Completed Bachelor of Engineering in Mysore, followed by Master's degree in Environmental Engineering from University of Sydney."
    },
    declaredAssetsCr: 42.04,
    totalAssetsCr: 42.04,
    liabilitiesCr: 0.0,
    assetGrowthPct: 18,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal cases declared in certified 2024 Lok Sabha ECI Form 26 affidavit; clean personal legal filing.",
    constituency: "Kannauj, Uttar Pradesh",
    stateName: "Uttar Pradesh",
    stateCode: "UP",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "Gomti Riverfront Development Project Inquiries",
        financialImpact: "₹1,500 Crore Audit Inquiry",
        description: "CBI preliminary enquiry into cost overruns and tender approvals for Gomti Riverfront beautification during 2012–2017 tenure.",
        status: "CBI Inquiries & State Scrutiny"
      }
    ],
    epicFailures: [
      {
        achievement: "Muzaffarnagar Riots (2013)",
        outlay: "Law & Order Breakdown",
        status: "Severe communal clashes resulting in 60+ fatalities and mass displacement, leading to intense judicial scrutiny."
      } as any
    ] as any,
    controversies: [
      "Samajwadi Party internal family succession feud (2016-2017) prior to assembly elections"
    ],
    keyWorks: [
      {
        achievement: "Agra-Lucknow Expressway (302 km)",
        outlay: "₹13,200 Crore",
        status: "Constructed India's longest 6-lane access-controlled expressway in a record 36 months with emergency fighter jet landing strip."
      },
      {
        achievement: "UP Dial 100 / 112 Emergency Police Response System",
        outlay: "Statewide Integrated Telemetry",
        status: "Modernized centralized police dispatch and emergency fleet response across all 75 districts of Uttar Pradesh."
      },
      {
        achievement: "Lucknow Metro Phase 1 Construction",
        outlay: "₹6,928 Crore",
        status: "Completed North-South corridor metro transit network connecting CCS Airport to Munshi Pulia."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 84,
      integrityAndCleanGovernance: 76,
      policyCompetence: 82,
      publicResponsiveness: 80,
      overallScore: 81
    },
    performanceScore: 81
  },
  "mahua-moitra": {
    name: "Mahua Moitra",
    slug: "mahua-moitra",
    title: "Member of Parliament (Lok Sabha, Krishnanagar)",
    currentPosition: "Member of Parliament for Krishnanagar, West Bengal (Re-elected 2024), All India Trinamool Congress (AITC)",
    ministry: "Parliamentary Representation & Standing Committee on Communications/IT",
    party: "All India Trinamool Congress (AITC)",
    photoUrl: LEADER_PHOTOS["mahua-moitra"],
    education: "BA in Economics & Mathematics (Mount Holyoke College, Massachusetts, USA)",
    educationDetails: {
      degree: "Bachelor of Arts in Economics & Mathematics",
      institution: "Mount Holyoke College, South Hadley, Massachusetts, USA",
      summary: "Graduated with dual majors in Economics and Mathematics; worked as Vice President at JPMorgan Chase in New York & London before entering Indian politics."
    },
    declaredAssetsCr: 4.15,
    totalAssetsCr: 4.15,
    liabilitiesCr: 0.0,
    assetGrowthPct: 12,
    criminalCases: 1,
    seriousCriminalCases: 0,
    criminalCaseNote: "Declared 1 pending political protest case in 2024 ECI Form 26 filing; faced cash-for-query parliamentary ethics expulsion in Dec 2023 before being re-elected by 56,000+ margin in 2024.",
    constituency: "Krishnanagar, Nadia, West Bengal",
    stateName: "West Bengal",
    stateCode: "WB",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "Cash-for-Query Parliamentary Ethics Inquiry",
        financialImpact: "Ethics Committee & CBI Preliminary Enquiry",
        description: "Expelled from 17th Lok Sabha in Dec 2023 over sharing parliamentary portal login credentials with businessman Darshan Hiranandani; CBI initiated preliminary inquiry.",
        status: "CBI Scrutiny & Supreme Court Challenge"
      }
    ],
    epicFailures: [
      {
        achievement: "Parliamentary Expulsion (Dec 2023)",
        outlay: "Lok Sabha Ethics Verdict",
        status: "Expelled on ethics committee recommendations before vindication via direct public mandate in 2024 general election."
      } as any
    ] as any,
    controversies: [
      "Fiery parliamentary debates criticizing corporate monopolies and central regulatory bodies"
    ],
    keyWorks: [
      {
        achievement: "Krishnanagar Rural Electrification & Nadia Road Infra",
        outlay: "₹120+ Crore MPLAD & State Schemes",
        status: "Completed extensive rural bridge connectivity, piped drinking water, and hospital modernization in Krishnanagar."
      },
      {
        achievement: "Parliamentary Scrutiny on Corporate Governance & Data Privacy",
        outlay: "Lok Sabha Debates",
        status: "Spearheaded national legislative debates on Pegasus spyware, privacy rights, and corporate conglomerate disclosures."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 78,
      integrityAndCleanGovernance: 70,
      policyCompetence: 88,
      publicResponsiveness: 80,
      overallScore: 78
    },
    performanceScore: 78
  },
  "tejashwi-yadav": {
    name: "Tejashwi Yadav",
    slug: "tejashwi-yadav",
    title: "Leader of Opposition in Bihar Assembly / RJD Leader",
    currentPosition: "Leader of Opposition in Bihar Legislative Assembly, Former Deputy Chief Minister of Bihar (2015–2017, 2022–2024), MLA for Raghopur",
    ministry: "Rashtriya Janata Dal (RJD) Leadership",
    party: "Rashtriya Janata Dal (RJD)",
    photoUrl: LEADER_PHOTOS["tejashwi-yadav"],
    education: "Secondary Schooling (Class 9, Delhi Public School, R.K. Puram, New Delhi)",
    educationDetails: {
      degree: "Secondary School Education (Class 9)",
      institution: "Delhi Public School (DPS), R.K. Puram, New Delhi",
      summary: "Pursued secondary education in New Delhi; professional cricketer (Delhi Daredevils squad) prior to entering public life in 2015."
    },
    declaredAssetsCr: 6.88,
    totalAssetsCr: 6.88,
    liabilitiesCr: 0.42,
    assetGrowthPct: 15,
    criminalCases: 11,
    seriousCriminalCases: 3,
    criminalCaseNote: "Declared 11 pending cases (including IRCTC hotel lease and land-for-jobs PMLA investigations) in certified ECI Form 26 affidavit; denies allegations as politically motivated.",
    constituency: "Raghopur, Vaishali, Bihar",
    stateName: "Bihar",
    stateCode: "BR",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "Land-for-Jobs Railway Recruitment Case",
        financialImpact: "₹600 Crore Alleged Asset Transfers",
        description: "CBI & ED chargesheets alleging transfer of land parcels in Patna at throwaway prices in exchange for Group D railway appointments during 2004–2009.",
        status: "Special CBI Court Trial & Bail Granted"
      },
      {
        title: "IRCTC Hotel Tender PMLA Inquiry",
        financialImpact: "Commercial Lease Dispute",
        description: "CBI inquiry into transfer of operational rights of two IRCTC railway hotels in Ranchi and Puri.",
        status: "Special Court Proceedings"
      }
    ],
    epicFailures: [
      {
        achievement: "Mahagathbandhan Government Collapse (Jan 2024)",
        outlay: "Coalition Instability",
        status: "Collapse of Mahagathbandhan government after Nitish Kumar's realignment with NDA."
      } as any
    ] as any,
    controversies: [
      "Intense political scrutiny regarding criminal cases and generational political lineage"
    ],
    keyWorks: [
      {
        achievement: "4.5 Lakh Bihar Government Teacher & Civil Appointments (2022–2023)",
        outlay: "Statewide Recruitment Drive",
        status: "Spearheaded fast-track transparent recruitment of 4.5 lakh government school teachers and civil officers via BPSC in 15 months."
      },
      {
        achievement: "Bihar Caste-Based Economic Survey (2023)",
        outlay: "Statewide Socio-Economic Census",
        status: "Successfully executed India's first comprehensive state socio-economic caste survey leading to expanded 75% reservation structure."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 82,
      integrityAndCleanGovernance: 58,
      policyCompetence: 76,
      publicResponsiveness: 86,
      overallScore: 74
    },
    performanceScore: 74
  },
  "shashi-tharoor": {
    name: "Shashi Tharoor",
    slug: "shashi-tharoor",
    title: "Member of Parliament (Lok Sabha, Thiruvananthapuram)",
    currentPosition: "Member of Parliament for Thiruvananthapuram (4 Consecutive Terms since 2009), Chairman of Parliamentary Standing Committee on Chemicals & Fertilisers, INC",
    ministry: "Parliamentary Representation & International Affairs",
    party: "Indian National Congress (INC)",
    photoUrl: LEADER_PHOTOS["shashi-tharoor"],
    education: "BA History (St. Stephen's College, Delhi), MA, MALD & Ph.D. in International Relations (Fletcher School of Law and Diplomacy, Tufts University, USA)",
    educationDetails: {
      degree: "Ph.D., Master of Arts in Law and Diplomacy (MALD) & BA History",
      institution: "St. Stephen's College, Delhi & Fletcher School of Law and Diplomacy, Tufts University, USA",
      summary: "Earned Doctorate at age 22 from Tufts University; served as Under-Secretary-General of the United Nations (1978–2007) and author of 25+ bestselling books."
    },
    declaredAssetsCr: 55.45,
    totalAssetsCr: 55.45,
    liabilitiesCr: 0.0,
    assetGrowthPct: 16,
    criminalCases: 0,
    seriousCriminalCases: 0,
    criminalCaseNote: "Zero criminal convictions declared in 2024 ECI Form 26 affidavit; fully discharged by Delhi High Court in Sunanda Pushkar case in Aug 2021 with clean judicial verdict.",
    constituency: "Thiruvananthapuram, Kerala",
    stateName: "Kerala",
    stateCode: "KL",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "IPL Kochi Tuskers Sweat Equity Controversy (2010)",
        financialImpact: "Franchise Bidding Scrutiny",
        description: "Opposition allegations regarding advisory sweat equity in Rendezvous Sports World; resigned as MoS External Affairs in 2010. No formal financial charges sustained.",
        status: "Resolved / No Charges"
      }
    ],
    epicFailures: [
      {
        achievement: "Congress Presidential Election Defeat (Oct 2022)",
        outlay: "Internal Party Election",
        status: "Contested INC presidential poll against Mallikarjun Kharge securing 1,072 delegate votes (11.9%)."
      } as any
    ] as any,
    controversies: [
      "Frequent intellectual debates and frank critiques of national policy narratives"
    ],
    keyWorks: [
      {
        achievement: "Vizhinjam International Transshipment Deepwater Seaport",
        outlay: "₹7,700 Crore Maritime Infrastructure",
        status: "Championed central cabotage waivers and environmental clearances for India's first automated mega-container transshipment port."
      },
      {
        achievement: "Thiruvananthapuram IT Technopark Expansion & AI Corridor",
        outlay: "₹2,500+ Crore Tech Investments",
        status: "Attracted major multinational tech hubs (Nissan Digital Hub, Taurus Downtown) creating 35,000+ high-tech jobs."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 84,
      integrityAndCleanGovernance: 82,
      policyCompetence: 92,
      publicResponsiveness: 84,
      overallScore: 86
    },
    performanceScore: 86
  },
  "asaduddin-owaisi": {
    name: "Asaduddin Owaisi",
    slug: "asaduddin-owaisi",
    title: "Member of Parliament (Lok Sabha) & President of AIMIM",
    currentPosition: "Member of Parliament for Hyderabad (5 Consecutive Terms since 2004), President of All India Majlis-e-Ittehadul Muslimeen (AIMIM)",
    ministry: "AIMIM National Leadership & Parliamentary Representation",
    party: "All India Majlis-e-Ittehadul Muslimeen (AIMIM)",
    photoUrl: LEADER_PHOTOS["asaduddin-owaisi"],
    education: "BA (Nizam College, Osmania University) & Barrister-at-Law (Lincolns Inn, London, UK)",
    educationDetails: {
      degree: "Bachelor of Arts & Barrister-at-Law",
      institution: "Nizam College, Osmania University & Honourable Society of Lincoln's Inn, London, UK",
      summary: "Graduated with BA from Osmania University and called to the Bar at Lincoln's Inn, London, practicing law before entering full-time politics."
    },
    declaredAssetsCr: 19.82,
    totalAssetsCr: 19.82,
    liabilitiesCr: 4.30,
    assetGrowthPct: 18,
    criminalCases: 5,
    seriousCriminalCases: 1,
    criminalCaseNote: "Declared 5 pending political protest and public demonstration cases in certified 2024 ECI Form 26 affidavit; zero criminal convictions.",
    constituency: "Hyderabad, Telangana",
    stateName: "Telangana",
    stateCode: "TG",
    isCM: false,
    scamsAndCorruption: [
      {
        title: "Public Demonstration & Protest Cases",
        financialImpact: "No Financial Scam Charges",
        description: "Cases registered under section 188 / 143 for unauthorized public rallies and political demonstrations in Hyderabad and Medak.",
        status: "Magistrate Court Proceedings"
      }
    ],
    epicFailures: [
      {
        achievement: "Electoral Expansions in UP and Bengal (2021–2022)",
        outlay: "National Footprint Strategy",
        status: "Failed to win seats in UP and West Bengal assembly elections despite intense campaign mobilization."
      } as any
    ] as any,
    controversies: [
      "Stirring debates on constitutional secularism, minority rights, and CAA/NRC implementation"
    ],
    keyWorks: [
      {
        achievement: "Hyderabad Old City Infrastructure & Owaisi Hospital Network",
        outlay: "₹450+ Crore Healthcare & Urban Roads",
        status: "Developed extensive subsidized super-specialty medical hospitals, Deccan College of Medical Sciences, and flyover networks in Old Hyderabad."
      },
      {
        achievement: "Outstanding Parliamentary Debater Record (Sansad Ratna)",
        outlay: "Lok Sabha Debates",
        status: "Maintained 90%+ attendance record and participated in 120+ major constitutional and legislative debates in Lok Sabha."
      }
    ],
    workScoreBreakdown: {
      schemeDelivery: 80,
      integrityAndCleanGovernance: 74,
      policyCompetence: 86,
      publicResponsiveness: 85,
      overallScore: 81
    },
    performanceScore: 81
  }
};

export const PM_PROFILE: MinisterProfile = {
  ...(ministersJson[0] || {}),
  ...COMPREHENSIVE_LEADERS["narendra-modi"],
  photoUrl: LEADER_PHOTOS["narendra-modi"]
} as MinisterProfile;

export const MINISTERS: MinisterProfile[] = (ministersJson.slice(1) || []).map((m: any) => {
  const slug = m.slug || nameToSlug(m.name || "");
  const enriched = COMPREHENSIVE_LEADERS[slug];
  const photo = LEADER_PHOTOS[slug] || enriched?.photoUrl || m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || "Leader")}&background=06038D&color=fff&size=256`;

  if (enriched) {
    return { ...m, ...enriched, photoUrl: photo };
  }
  return {
    ...m,
    slug,
    photoUrl: photo,
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
