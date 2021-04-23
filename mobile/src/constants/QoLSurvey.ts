export const Domains = [
    "PHYSICAL",
    "SLEEP",
    "MOOD",
    "COGNITION",
    "LEISURE",
    "RELATIONSHIPS",
    "SPIRITUAL",
    "MONEY",
    "HOME",
    "SELF-ESTEEM",
    "INDEPENDENCE",
    "IDENTITY",
]

export const Strategies = [
   {strat:"Consectetur adipiscing elit", info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor1", domains:["PHYSICAL"]},
   {strat:"Eiusmod tempor incididunt ut", info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor2",domains:["MOOD", "COGNITION"]},
   {strat:"Aliquip ex ea commodo consequat", info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor3",domains:["LEISURE", "PHYSICAL"]},
   {strat:"Excepteur sint occaecat cupidatat", info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor4",domains:["HOME", "SELF_ESTEEM"]},
   {strat:"culpa qui officia deserunt mollit", info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor5",domains:["IDENTITY", "INDEPENDENCE"]},
   {strat:"Vulputate mi sit amet mauris commodo",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor6",domains:["MONEY", "RELATIONSHIPS", "SPIRITUALITY"]},
   {strat:"Viverra nam libero justo ", info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor7",domains:["IDENTITY"]},
   {strat:"Integer feugiat scelerisque",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor8", domains:["SLEEP"]},
   {strat:"Consectetur adipiscing elit12",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor9", domains:["SLEEP", "MONEY"]},
   {strat:"Eiusmod tempor incididunt 3",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor10", domains:["SPIRITUAL"]},
   {strat:"Aliquip ex ea commodo consequat12",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor11", domains:["MOOD", "SLEEP", "IDENTITY"]},
   {strat:"Excepteur sint occaecat cupidatat12",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor12", domains: ["SELF_ESTEEM", "INDEPENDENCE", "MONEY"]},
   {strat:"Consectetur adipiscing elit1",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor143", domains:["LEISURE", "MONEY"]},
   {strat:"Eiusmod tempor incididunt ut1",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor14", domains:["SPIRITUAL", "PHYSICAL"]},
   {strat:"Aliquip ex ea commodo consequat1",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor15", domains:["MOOD", "SLEEP", "COGNITION"]},
   {strat:"Excepteur sint occaecat cupidatat1",info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor16", domains: ["SELF_ESTEEM", "INDEPENDENCE"]},
]

export const Domain_Importance =  [
    "PHYSICAL = Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    "SLEEP = Sleeeeepz Sleeeeepz Sleeeeepz Sleeeeepz incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ",
    "MOOD = exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure Million Dollar Bills Million Dollar Bills Million Dollar Bills Million Dollar Bills",
    "COGNITION = dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Smarty Pants",
    "LEISURE = Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit ",
    "RELATIONSHIPS = Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ",
    "SPIRITUAL = Arcu felis bibendum ut tristique et egestas quis ipsum suspendisse",
    "MONEY = Sem fringilla ut morbi tincidunt augue interdum velit euismod in",
    "HOME = Gravida quis blandit turpis cursus in. Rutrum quisque non tellus orci",
    "SELFESTEEM = Egestas diam in arcu cursus euismod quis viverra nibh. Ac turpis egestas ",
    "INDEPENDENCE = Orci a scelerisque purus semper eget duis at tellus at.",
    "IDENTITY = ullamcorper morbi tincidunt ornare massa eget egestas. Vitae justo"
]

export const DOMAIN_QUESTION_COUNT = 4;

export const SurveyQuestions  = [
    "Had plenty of energy",
    "Had the right amount of exercise for me",
    "Felt physically well",
    "Been content with my sex life",

    "Awoken feeling refreshed",
    "Had no problems getting out of bed",
    "Had about the right amount of sleep for me",
    "Kept a rountine in my sleep-wake schedule",

    "Felt happy",
    "Enjoyed things as much as I ususally do",
    "Felt able to cope",
    "Felt emotionally balanced",

    "Thought clearly",
    "Had good concentration",
    "Had no difficulties with my memory",
    "Made plans without difficulty",

    "Enjoyed my leisure activities",
    "Been interested in my leisure activities",
    "Had fun during my leisure activities",
    "Expressed my creativity",

    "Enjoyed spending time with other people",
    "Been interested in my social relationships",
    "Had meaningful friendships",
    "Been able to share feelings or problems with a friend",

    "Been satisfied with the spiritual side of my life",
    "Expressed my spirituality as I wish",
    "Practised my spirituality as I wish",
    "Kept routine in my spiritual life",

    "Had enough money for basic needs",
    "Had enough money for extras",
    "Felt secure about my current financial situation",
    "Had no difficulties with debts",

    "Done my daily household chores",
    "Been organized around my home",
    "Kept my home tidy",
    "Kept my home clean",

    "Felt respected",
    "Felt accepted by others",
    "Felt as worthwhile as other people",
    "Felt able to cope with stigma",

    "Had a sense of freedom",
    "Felt safe in my home environment",
    "Traveled around freely (e.g., driving, using public transport)",
    "Felt others have allowed me my independence",

    "Had a strong sense of self",
    "Had a stable sense of what I’m really like",
    "Had a clear idea of what I want and don’t want",
    "Had control over my life",
];



export const QUESTIONS_COUNT = SurveyQuestions.length; // 48
export const DOMAIN_COUNT = Domains.length; // 12