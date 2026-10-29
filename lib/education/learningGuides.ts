import type { HabitPillar } from './habitDraft';
import type { PillarType } from '@/lib/presets/types';
import type { JourneyConstraint } from './startJourney';

export const GUIDE_SOURCE_CHECKED_ON = '2026-10-28';
export type GuideSource = { id: string; title: string; url: string; supports: string; scope: string; publisher: string; kind: string };
export type GuideIdea = { id: string; text: string };
export type GuideSection = { id: string; title: string; paragraphs: readonly string[]; sourceIds: readonly string[] };
export type LearningGuide = {
  slug: string; pillar: HabitPillar; topicLabel: string; title: string; description: string; audience: string;
  summary: string; takeaways: readonly string[]; sections: readonly GuideSection[];
  ideas: readonly GuideIdea[]; ideaSourceIds: readonly string[]; reflection: string; sources: readonly GuideSource[];
};
export const LEARNING_GUIDES: readonly LearningGuide[] = [
  {
    "slug": "movement-and-strength",
    "pillar": "Fitness",
    "topicLabel": "Movement",
    "title": "Movement and strength: a manageable starting point",
    "description": "Understand weekly activity guidance, moderate and vigorous intensity, strengthening activity and how to choose a manageable first step.",
    "audience": "General adult education. The weekly figures in the first section apply to ages 19–64; a separate section explains guidance for ages 65 and over. Choose activities and support that fit your circumstances.",
    "summary": "Learn how aerobic activity and strengthening activity fit together, then choose a manageable starting point for your circumstances.",
    "takeaways": [
      "Intensity and strength both matter.",
      "Build gradually within your current ability."
    ],
    "sections": [
      {
        "id": "activity-and-intensity",
        "title": "What weekly activity guidance means",
        "sourceIds": [
          "activity"
        ],
        "paragraphs": [
          "NHS guidance for ages 19–64 describes at least 150 minutes of moderate or 75 minutes of vigorous aerobic activity a week, plus strengthening on at least two days. Break up long periods of sitting.",
          "At moderate intensity you can usually talk but not sing. With vigorous effort, you may manage only a few words before pausing for breath."
        ]
      },
      {
        "id": "strength-at-home",
        "title": "Make room for strength as well",
        "sourceIds": [
          "strength"
        ],
        "paragraphs": [
          "The NHS home-strength guide demonstrates options such as sit-to-stand movements and wall press-ups. Read the full instructions, use suitable support and build up slowly. Choose exercises that fit your current ability.",
          "For chair-based exercises, the NHS specifies a stable chair without wheels that will not slide. If you are unsure about a movement or setup, ask for help adapting it."
        ]
      },
      {
        "id": "fit-your-day",
        "title": "Give the action a cue",
        "sourceIds": [],
        "paragraphs": [
          "Pick one moment you can recognise, such as finishing lunch or arriving home. Decide what would make the action easier to repeat: a smaller version, suitable space or company.",
          "Use your weekly plan to record what you actually tried and what helped. You can change the plan after reflecting on how it fitted your day."
        ]
      },
      {
        "id": "appropriate-support",
        "title": "Adapt the guidance and seek support",
        "sourceIds": [
          "activity"
        ],
        "paragraphs": [
          "Speak to a GP before starting if you have been inactive for a while, have a medical condition or have concerns about exercising."
        ]
      },
      {
        "id": "age-appropriate-guidance",
        "title": "If you are aged 65 or over",
        "sourceIds": [
          "older"
        ],
        "paragraphs": [
          "NHS guidance for adults aged 65 and over includes activity every day, even light movement, and strength, balance and flexibility activities on at least two days a week.",
          "It describes at least 150 minutes of moderate activity weekly, or 75 minutes of vigorous activity if you are already active, or a combination. Adapt activity and intensity to your fitness. Break up long periods of sitting.",
          "If you have been inactive, have medical conditions or have concerns, speak to a GP before starting. If falls or balance worry you, ask for help choosing suitable activity."
        ]
      },
      {
        "id": "adapt-movement",
        "title": "Explore seated movement and suitable support",
        "sourceIds": [
          "sitting"
        ],
        "paragraphs": [
          "The NHS sitting-exercise page offers gentle seated demonstrations and advises building up gradually. Read the full instructions before trying an activity; check with a GP or a professional involved in your care if you are unsure whether it is suitable.",
          "These demonstrations assume a solid chair without wheels, feet flat on the floor and knees at right angles. Ask for help choosing a suitable setup if those assumptions do not fit your seating or movement needs.",
          "Your next step can be finding an appropriate activity or arranging support. Choose a manageable action without copying a routine that does not suit your circumstances."
        ]
      },
      {
        "id": "international-perspective",
        "title": "A global perspective: WHO",
        "sourceIds": [
          "who-activity"
        ],
        "paragraphs": [
          "WHO describes physical activity broadly: it can happen during leisure, transport, work or domestic life. Its examples include walking, cycling and wheeling.",
          "WHO emphasises that some activity is better than none and that recommendations include people with chronic conditions and disabilities. This broadens the options beyond organised exercise.",
          "Use age-specific guidance and suitability advice to choose a manageable activity. A global overview and an individual exercise plan serve different purposes."
        ]
      }
    ],
    "ideas": [
      {"id":"movement-suitable-activity","text":"Choose a suitable activity you enjoy, or ask for help finding one that fits your ability, seating and available space."},
      {"id":"movement-read-strength","text":"Read one NHS strength demonstration and decide what support or adaptation you need before trying it."}
    ],
    "ideaSourceIds": [
      "activity",
      "strength"
    ],
    "reflection": "Was the cue easy to notice? Did the action fit my ability and circumstances? What could make the next attempt more manageable?",
    "sources": [
      {
        "id": "activity",
        "title": "NHS: physical activity for adults aged 19–64",
        "url": "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/",
        "supports": "Weekly aerobic activity, intensity, strengthening activity and adapting exercise to fitness.",
        "scope": "General guidance for adults aged 19–64; it does not set a personal exercise prescription.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "strength",
        "title": "NHS: strength exercises",
        "url": "https://www.nhs.uk/live-well/exercise/strength-exercises/",
        "supports": "Home exercise examples, gradual progression and equipment setup.",
        "scope": "Read the full demonstrations and adapt activities to your health and ability.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "older",
        "title": "NHS: physical activity for older adults",
        "url": "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/",
        "supports": "Daily activity, strength, balance, flexibility and age-appropriate weekly guidance for adults aged 65 and over.",
        "scope": "Linked for the appropriate age group; this guide does not assess balance or falls risk.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "sitting",
        "title": "NHS: sitting exercises",
        "url": "https://www.nhs.uk/live-well/exercise/sitting-exercises/",
        "supports": "Seated demonstrations, gradual progression, chair setup and checking suitability with a care professional.",
        "scope": "These exercises assume a specified chair setup; they are not a universal routine for every disability or seating need.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "who-activity",
        "title": "WHO: physical activity",
        "url": "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
        "supports": "Activity across transport, work, leisure and daily life, including people with disabilities.",
        "scope": "A global public-health overview for different populations; it does not select a personal activity dose.",
        "publisher": "World Health Organization",
        "kind": "Global public-health information"
      }
    ]
  },
  {
    "slug": "balanced-meals",
    "pillar": "Nutrition",
    "topicLabel": "Food",
    "title": "Balanced meals: build on food you already eat",
    "description": "Use the NHS Eatwell Guide to understand food-group balance and find small, practical changes to familiar meals.",
    "audience": "General adult eating guidance. Individual dietary requirements and medical needs may require advice from a registered dietitian.",
    "summary": "Start with familiar meals and a change that fits what you enjoy, can obtain and can prepare. Look at the pattern across days.",
    "takeaways": [
      "Look at the pattern across meals.",
      "The Explorer’s food percentage is an illustration rather than a dietary target."
    ],
    "sections": [
      {
        "id": "balance-over-time",
        "title": "Think across the day and week",
        "sourceIds": [
          "eatwell"
        ],
        "paragraphs": [
          "The Eatwell Guide describes variety across food groups. You do not have to reproduce its proportions at every meal; consider the overall balance across a day or week.",
          "Include starchy foods, fruit and vegetables, protein foods, dairy or suitable alternatives, and small amounts of unsaturated oils. The guide does not set a whole-food percentage target."
        ]
      },
      {
        "id": "familiar-swaps",
        "title": "Make one familiar meal easier to build on",
        "sourceIds": [
          "eating"
        ],
        "paragraphs": [
          "Higher-fibre choices include wholegrain bread, brown rice, wholewheat pasta and potatoes with their skins on. Choose an option that fits a meal you already make.",
          "Fruit and vegetables can be fresh, frozen or canned. Keeping a usable option available can make a meal change easier. Variety matters; you do not need a special product."
        ]
      },
      {
        "id": "practical-planning",
        "title": "Plan around access and preferences",
        "sourceIds": [],
        "paragraphs": [
          "Pick a meal you prepare or choose regularly. Decide what is within your control, including ingredients, cooking facilities and support from other people.",
          "Use the planner to describe a specific action in your own words. Record what made the meal practical and what you would adjust, rather than trying to maximise an Explorer slider."
        ]
      },
      {
        "id": "dietary-support",
        "title": "When general advice needs adapting",
        "sourceIds": [
          "eatwell"
        ],
        "paragraphs": [
          "If you have medical or special dietary requirements, speak with a registered dietitian about adapting the Eatwell Guide. Keep following the eating advice provided for your individual care."
        ]
      },
      {
        "id": "international-perspective",
        "title": "Another perspective: Harvard’s Healthy Eating Plate",
        "sourceIds": [
          "harvard-plate"
        ],
        "paragraphs": [
          "Harvard’s Healthy Eating Plate offers another way to think about meal quality. It highlights vegetables and fruit, whole grains, protein choices such as beans or nuts, and healthy plant oils.",
          "Its approximate plate proportions are not calorie amounts or fixed daily servings. Harvard explains how the ideas can be used with soups, shared dishes and different cultural food traditions.",
          "Harvard’s plate and the NHS Eatwell Guide group and present foods differently. Use them as named educational frameworks rather than combining their diagrams into a score. Individual dietary needs still require appropriate advice."
        ]
      }
    ],
    "ideas": [
      {"id":"food-fibre-swap","text":"Try a higher-fibre version of a familiar starchy food."},
      {"id":"food-vegetable-option","text":"Add a vegetable option you can obtain and prepare to a meal you already eat."},
      {"id":"food-beans-lentils","text":"Consider beans or lentils as a protein option when they fit your diet and meal."}
    ],
    "ideaSourceIds": [
      "eatwell",
      "eating"
    ],
    "reflection": "Was the food available and practical to prepare? Did I enjoy it? What would make this choice easier next time?",
    "sources": [
      {
        "id": "eatwell",
        "title": "NHS: the Eatwell Guide",
        "url": "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/",
        "supports": "Food-group variety, balance over time and adapting advice for dietary or medical needs.",
        "scope": "General eating guidance, without a personalised meal plan or whole-food percentage target.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "eating",
        "title": "NHS: 8 tips for healthy eating",
        "url": "https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/eight-tips-for-healthy-eating/",
        "supports": "Higher-fibre staples, fruit and vegetables, and everyday food choices.",
        "scope": "Ideas need adapting to allergies, access, culture, preferences and individual care.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "harvard-plate",
        "title": "Harvard The Nutrition Source: Healthy Eating Plate",
        "url": "https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/",
        "supports": "An academic teaching model emphasising food quality, vegetables, fruit, whole grains, protein choices and healthy plant oils.",
        "scope": "Created by Harvard nutrition experts and Harvard Health editors; an educational model, not a US government dietary guideline or an individual prescription.",
        "publisher": "Harvard The Nutrition Source",
        "kind": "Academic nutrition education"
      }
    ]
  },
  {
    "slug": "sleep-routines",
    "pillar": "Sleep",
    "topicLabel": "Sleep",
    "title": "Sleep routines: make room for rest",
    "description": "Understand adult sleep needs, practical routines and shift-work considerations, with guidance on when to seek help for persistent sleep problems.",
    "audience": "General education for adults. Sleep needs and the causes of sleep problems vary between people.",
    "summary": "Consider routine, surroundings and daytime functioning. Choose one change within your control and notice how it fits your life.",
    "takeaways": [
      "Routine and daytime functioning matter alongside duration.",
      "Persistent sleep problems deserve support."
    ],
    "sections": [
      {
        "id": "sleep-needs",
        "title": "Use duration as part of the picture",
        "sourceIds": [
          "sleep"
        ],
        "paragraphs": [
          "Adults commonly need around 7–9 hours of sleep, with individual variation. How rested, alert and able to function you feel during the day also matters.",
          "The Explorer’s duration setting cannot assess sleep quality or identify a sleep disorder. A brighter illustration does not establish that you are sleeping well."
        ]
      },
      {
        "id": "wind-down",
        "title": "Choose a repeatable wind-down step",
        "sourceIds": [
          "insomnia"
        ],
        "paragraphs": [
          "NHS advice includes a regular getting-up time, going to bed when sleepy and allowing time to relax before bed. Reading or another quiet activity can be part of that routine.",
          "Choose a step that fits your circumstances. The routine is something to adapt; you do not need to complete a perfect checklist before resting."
        ]
      },
      {
        "id": "sleep-surroundings",
        "title": "Look at what surrounds your sleep",
        "sourceIds": [
          "sleep"
        ],
        "paragraphs": [
          "Noise, light, temperature and an uncomfortable bed can interfere with sleep. Consider one change you can make to your surroundings.",
          "Caffeine and alcohol can also affect sleep. If you think a medicine is contributing to a sleep problem, speak to a GP or pharmacist about it."
        ]
      },
      {
        "id": "shift-work",
        "title": "If shifts change your sleep time",
        "sourceIds": [
          "shifts"
        ],
        "paragraphs": [
          "HSE guidance suggests finding a suitable sleep schedule, making the space comfortable and discussing your sleep times with people around you. A familiar wind-down routine can help organise the period before your main sleep.",
          "Use a cue around your actual rest period rather than assuming everyone sleeps at night. Consider what can protect that rest from avoidable interruptions."
        ]
      },
      {
        "id": "sleep-support",
        "title": "When to seek help",
        "sourceIds": [
          "insomnia"
        ],
        "paragraphs": [
          "Speak to a GP if changes to your habits have not helped, problems have lasted for months or poor sleep is making daily life hard to cope with. Assessment may lead to treatment such as cognitive behavioural therapy.",
          "Do not drive when you feel sleepy."
        ]
      },
      {
        "id": "international-perspective",
        "title": "Another perspective: CDC sleep guidance",
        "sourceIds": [
          "cdc-sleep"
        ],
        "paragraphs": [
          "The US Centers for Disease Control and Prevention emphasises both sleep duration and sleep quality. It recommends seven or more hours for adults aged 18–60, seven to nine hours for ages 61–64, and seven to eight hours for ages 65 and over.",
          "Those age bands are more specific than the general NHS adult range described above. They are population recommendations rather than a test of whether one person’s sleep is adequate.",
          "CDC advises discussing regular sleep problems with a healthcare provider. Consider how you function during the day and seek help when needed, rather than trying to maximise a duration setting."
        ]
      }
    ],
    "ideas": [
      {"id":"sleep-quiet-activity","text":"Choose one quiet activity before your main rest period."},
      {"id":"sleep-room-change","text":"Consider one practical change to light, noise or comfort in your sleep space."}
    ],
    "ideaSourceIds": [
      "sleep"
    ],
    "reflection": "Did this step fit my actual rest period? What was within my control? Do ongoing sleep problems need professional support?",
    "sources": [
      {
        "id": "insomnia",
        "title": "NHS: insomnia",
        "url": "https://www.nhs.uk/conditions/insomnia/",
        "supports": "Adult sleep needs, sleep habits, driving safety and when to see a GP.",
        "scope": "General information; it does not diagnose the cause of a sleep problem.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "sleep",
        "title": "NHS Every Mind Matters: sleep problems",
        "url": "https://www.nhs.uk/every-mind-matters/mental-health-issues/sleep/",
        "supports": "Daytime functioning, sleep surroundings and common influences on sleep.",
        "scope": "Practical support rather than a guarantee that a routine will resolve persistent insomnia.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "shifts",
        "title": "HSE: hints and tips for shift workers",
        "url": "https://www.hse.gov.uk/humanfactors/topics/shift-workers.htm",
        "supports": "Finding a suitable sleep schedule and protecting sleep around shifts.",
        "scope": "Work-pattern advice; the sleep-duration range in this guide follows the NHS references.",
        "publisher": "Health and Safety Executive",
        "kind": "UK workplace guidance"
      },
      {
        "id": "cdc-sleep",
        "title": "CDC: about sleep",
        "url": "https://www.cdc.gov/sleep/about/index.html",
        "supports": "Age-specific sleep recommendations, sleep quality, routines and help for recurring sleep problems.",
        "scope": "US public-health information; its adult age bands and wording differ from the NHS general adult range.",
        "publisher": "Centers for Disease Control and Prevention",
        "kind": "US public-health information"
      }
    ]
  },
  {
    "slug": "stress-and-support",
    "pillar": "Stress",
    "topicLabel": "Stress & support",
    "title": "Stress and support: choose a manageable next step",
    "description": "Explore practical coping ideas, comfortable breathing and social support, with clear routes to professional and urgent help.",
    "audience": "General education for adults. Coping ideas can support daily life alongside appropriate professional care.",
    "summary": "A next step can be a practical change, a comfortable pause or support from another person. Choose something that fits your situation.",
    "takeaways": [
      "A practical step and support can work together.",
      "Urgent help is available when you need it."
    ],
    "sections": [
      {
        "id": "manageable-changes",
        "title": "Choose one thing within reach",
        "sourceIds": [
          "stress"
        ],
        "paragraphs": [
          "NHS advice includes small manageable goals, talking about how you feel and planning for difficult days. Trying to change everything at once can make the task harder.",
          "Start by identifying a situation that puts pressure on you. Consider one practical step and who could support you with it."
        ]
      },
      {
        "id": "comfortable-breathing",
        "title": "Try comfortable breathing if it suits you",
        "sourceIds": [
          "breathing"
        ],
        "paragraphs": [
          "The NHS breathing exercise uses a comfortable position and gentle, regular breathing. Let the breath move comfortably without forcing it; a steady count can help if you find that useful.",
          "You can choose a comfortable pause or another coping activity. Read the NHS instructions if you want to try its full breathing practice."
        ]
      },
      {
        "id": "connection-and-priorities",
        "title": "Make room for connection and practical support",
        "sourceIds": [
          "pressures"
        ],
        "paragraphs": [
          "NHS suggestions include connecting with people, being active, setting aside time for yourself and choosing practical priorities. A conversation can help you think through a problem or find support.",
          "Some pressures need changes beyond an individual habit. Consider what you can influence and where help from other people could make a difference."
        ]
      },
      {
        "id": "ongoing-support",
        "title": "Seek further support when you need it",
        "sourceIds": [
          "stress"
        ],
        "paragraphs": [
          "Speak with a GP if you are struggling to cope or the things you are trying are not helping. NHS talking therapies may also help; the linked NHS page explains routes to support.",
          "Use the urgent-help information near the top of this guide if you need help now or cannot stay safe."
        ]
      },
      {
        "id": "international-perspective",
        "title": "A global perspective: WHO on coping with stress",
        "sourceIds": [
          "who-stress"
        ],
        "paragraphs": [
          "WHO notes that people respond to stressful situations differently. Its coping advice includes keeping a daily routine, connecting with people you trust and making time for suitable activity.",
          "WHO also suggests limiting news and social-media exposure if it increases your stress. This can be one practical adjustment alongside addressing the pressures you face.",
          "When coping is difficult, WHO encourages seeking help from a trusted healthcare provider or another trusted person in the community. Use support services appropriate to where you live."
        ]
      }
    ],
    "ideas": [
      {"id":"stress-trusted-person","text":"Choose a suitable moment to talk with someone you trust."},
      {"id":"stress-comfortable-pause","text":"Make space for a comfortable pause, or read the NHS breathing practice."},
      {"id":"stress-practical-priority","text":"Identify one practical task to prioritise and one source of support."}
    ],
    "ideaSourceIds": [
      "breathing",
      "pressures"
    ],
    "reflection": "What helped me cope? Did I need a smaller step, a practical change or more support from someone else?",
    "sources": [
      {
        "id": "stress",
        "title": "NHS: getting help with stress",
        "url": "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/",
        "supports": "Small manageable changes, social support and routes to professional help.",
        "scope": "General coping advice; it does not identify the cause of symptoms or provide therapy.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "breathing",
        "title": "NHS: breathing exercises for stress",
        "url": "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
        "supports": "A comfortable, gentle breathing practice without forcing the breath.",
        "scope": "One optional coping practice; people can choose a different comfortable activity or seek support.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "pressures",
        "title": "NHS: 10 stress busters",
        "url": "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/tips-to-reduce-stress/",
        "supports": "Connection, activity, time for yourself and practical priorities.",
        "scope": "Ideas to adapt; they do not remove every source of stress.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "urgent",
        "title": "NHS: urgent mental health help",
        "url": "https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/",
        "supports": "Urgent NHS help and emergency routes when someone cannot stay safe.",
        "scope": "NHS 111 signposting here is for England; local arrangements differ elsewhere.",
        "publisher": "NHS",
        "kind": "UK public-health information"
      },
      {
        "id": "samaritans",
        "title": "Samaritans: contact a Samaritan",
        "url": "https://www.samaritans.org/how-we-can-help/contact-samaritan/",
        "supports": "Free listening support by telephone on 116 123, day or night.",
        "scope": "The telephone service is signposted for the UK and Ireland.",
        "publisher": "Samaritans",
        "kind": "Listening-service information"
      },
      {
        "id": "who-stress",
        "title": "WHO: stress questions and answers",
        "url": "https://www.who.int/news-room/questions-and-answers/item/stress",
        "supports": "Varied stress responses, daily routines, connection and seeking support when coping is difficult.",
        "scope": "Global coping information, not a diagnosis or a substitute for local professional or emergency services.",
        "publisher": "World Health Organization",
        "kind": "Global public-health information"
      }
    ]
  }
];

export function getLearningGuide(slug: unknown): LearningGuide | undefined {
  return typeof slug === 'string' ? LEARNING_GUIDES.find(guide => guide.slug === slug) : undefined;
}
export function guideForPillar(pillar: PillarType): LearningGuide | undefined {
  return LEARNING_GUIDES.find(guide => guide.pillar === pillar);
}
export function learningGuideHref(pillar: PillarType, constraint?: JourneyConstraint): string | undefined {
  const guide = guideForPillar(pillar);
  return guide ? '/learn/' + guide.slug + (constraint ? '?idea=' + constraint : '') : undefined;
}
export function learningGuideSearchText(guide: LearningGuide | undefined): string {
  if (!guide) return '';
  return [guide.title, guide.description, guide.audience, guide.summary, ...guide.takeaways,
    ...guide.sections.flatMap(section => [section.title, ...section.paragraphs]), ...guide.ideas.map(idea => idea.text), guide.reflection,
    ...guide.sources.flatMap(source => [source.title, source.publisher, source.kind, source.supports, source.scope])]
    .join(' ');
}
