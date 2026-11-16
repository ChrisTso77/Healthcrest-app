import type { Block, Lesson } from './types';

const b = (id: string, title: string, text: string, ...claimIds: string[]): Block => ({ id, title, text, claimIds });

export const LESSONS: readonly Lesson[] = [
  {
    id: 'movement', title: 'Movement: build capacity in everyday life',
    subtitle: 'Activity, strength, balance and an achievable starting point',
    summary: b('summary', 'Movement in a minute', 'Movement includes everyday activity as well as exercise. Activities that make you breathe faster and activities that challenge muscles contribute in different ways. Choose something suitable and manageable. A weekly guideline is a direction to work towards, not a test you must pass before activity counts.', 'MOV-003', 'MOV-004', 'MOV-007'),
    takeaways: [
      b('capacity', 'Think beyond exercise sessions', 'Walking, cycling, wheeling and movement during daily life can all be physical activity. The options available to you matter.', 'MOV-007'),
      b('intensity', 'Notice effort as well as minutes', 'At moderate effort you can usually talk but not sing. Vigorous effort makes conversation harder. This is a rough guide to intensity, not a medical safety check.', 'MOV-002'),
      b('strength', 'Include more than one kind of activity', 'Strengthening activity and aerobic activity serve different purposes. Older-adult guidance also gives balance and flexibility explicit attention.', 'MOV-001', 'MOV-006'),
    ],
    practical: [
      b('choose', '1. Choose an opportunity', 'Pick an activity you enjoy or would like help adapting. A plan can begin with finding a suitable option rather than performing an exercise immediately. Consider the space, equipment, support and access available.', 'MOV-007', 'BEH-001'),
      b('cue', '2. Give it a recognisable cue', 'For example: after lunch, I will try a manageable movement break. This is an example to adapt, not a dose calculated from your settings. With changing shifts, use an event that moves with your day.', 'BEH-001'),
      b('barriers', '3. Plan for ordinary obstacles', 'If time is limited, identify a smaller opportunity. If cost is a barrier, consider an accessible free option. If balance, pain or seating make an activity unsuitable, ask for help adapting it rather than copying a universal routine.', 'MOV-007', 'BEH-001'),
      b('notice', '4. Notice, then adjust', 'Ask whether the activity fitted your ability and circumstances. What support or practical change would help next time? A missed opportunity is information for the next plan, not a failed health score.', 'BEH-001', 'MODEL-001'),
    ],
    science: [
      b('oxygen', 'How the body responds', 'Working muscles need oxygen and fuel. Heart and breathing responses help meet that demand. Repeated suitable aerobic activity can strengthen the heart and improve its pumping capacity. These adaptations help explain improvements in capacity; an animation cannot show whether they have happened in you.', 'MOV-003', 'MODEL-001'),
      b('dose', 'Why there is no magic boundary', 'Large prospective studies follow people over time. Reviews find that more active and increasingly active people tend to have lower mortality. Benefits are not limited to one weekly threshold. However, illness can reduce activity, and other differences between people can influence the results. These associations do not supply a personal risk-reduction percentage.', 'MOV-004'),
      b('ageing', 'Strength, balance and ageing', 'A Cochrane review found strong evidence that exercise programmes reduce falls in community-dwelling older adults. Balance and functional exercises are important examples. That result does not mean every walking or strength-only programme prevents falls; fracture and adverse-event evidence was less certain.', 'MOV-005'),
      b('measures', 'What researchers measure', 'Studies may measure activity with questionnaires or devices, everyday function, fitness, falls or later disease outcomes. These are different endpoints. Reporting more minutes is not the same as demonstrating improved function, and the Explorer measures neither.', 'MOV-003', 'MOV-004', 'MOV-005', 'MODEL-001'),
      b('connection', 'A connection with sleep', 'Trials suggest exercise can improve some sleep outcomes. Results vary with the activity, population and way sleep is measured. This supports exploring suitable activity, not a promise that exercise will resolve persistent insomnia.', 'LINK-001'),
    ],
    faqs: [
      b('below-target', 'Does activity count below the weekly target?', 'Yes. The evidence does not describe an all-or-nothing threshold. A suitable manageable increase can be worthwhile.', 'MOV-004'),
      b('walking-strength', 'Does walking replace strength activity?', 'Not necessarily. Adult guidance includes strengthening alongside aerobic activity. The intensity and type of the task matter.', 'MOV-001'),
      b('universal', 'Is there one exercise routine for every disability?', 'No. Choose activity and support that fit your ability and circumstances. A seated demonstration may still assume a particular chair, posture or range of movement.', 'MOV-007'),
    ],
    safety: b('safety', 'Suitability comes first', 'Adapt activity to your health and fitness. UK guidance advises speaking with a GP if you have been inactive for some time or have medical conditions or concerns. Use appropriate local professional advice elsewhere. These lessons do not assess symptoms or prescribe rehabilitation.', 'MOV-001', 'MOV-006'),
    glossary: [{ term: 'Aerobic', meaning: 'Activity that increases breathing and heart rate to support sustained effort.' }, { term: 'Functional exercise', meaning: 'Practice involving movements useful in everyday tasks.' }, { term: 'Association', meaning: 'Two things occur together; that alone does not prove one caused the other.' }],
    diagram: { title: 'Different activities contribute in different ways', description: 'Three equal labelled boxes show aerobic activity, muscle challenge, and balance or function. They represent complementary categories, not a sequence, dose, body measurement or ranking.', labels: ['Aerobic activity', 'Muscle challenge', 'Balance and function'], claimIds: ['MOV-001', 'MOV-005', 'MOV-006'] },
    quiz: { question: 'What does the weekly activity guideline mean?', options: ['No benefit is possible below it.', 'It is population guidance, with room for suitable smaller steps.', 'It validates the Explorer colour.'], answer: 1, explanation: 'Activity benefits are not all-or-nothing. Guidance does not validate an animation or assess personal suitability.', claimIds: ['MOV-004', 'MODEL-001'] },
    video: { objective: 'Distinguish activity types from a personal health score.', scenes: [
      { seconds: 12, visual: 'Labelled examples: walking, wheeling and activity at home; avoid a single assumed body type.', narration: 'Movement includes everyday activity as well as exercise. Choose an option that fits your ability, circumstances and available support.', claimIds: ['MOV-007'] },
      { seconds: 12, visual: 'Three static cards, matching the accessible diagram; no internal body glow.', narration: 'Aerobic activity, muscle challenge, and balance or functional activity contribute in different ways. Minutes alone do not tell the whole story.', claimIds: ['MOV-001', 'MOV-006'] },
      { seconds: 12, visual: 'A simple plan with a cue and an optional smaller version; no streak or score.', narration: 'Choose a manageable opportunity and consider what would make it easier. A weekly target is not a pass or fail test.', claimIds: ['BEH-001', 'MOV-004'] },
      { seconds: 12, visual: 'Plain text: education, not personal assessment. Show original source credits.', narration: 'Use guidance appropriate to your age and circumstances. The Explorer illustrates selected settings; it does not measure your body or decide what is safe for you.', claimIds: ['MODEL-001', 'MOV-001'] },
    ] },
  },
  {
    id: 'food', title: 'Food: build a pattern that works for you',
    subtitle: 'Variety, food functions and practical choices',
    summary: b('summary', 'Food in a minute', 'Balanced eating concerns the pattern of food you can obtain, enjoy and prepare. Build on familiar meals with variety. One meal does not need to be perfect, and a whole-food percentage cannot tell whether you are meeting your needs.', 'FOOD-001', 'FOOD-006'),
    takeaways: [
      b('pattern', 'Look across meals', 'Food-group diagrams help explain balance over time. They are teaching tools, not scores for individual meals.', 'FOOD-001'),
      b('variety', 'Foods have overlapping functions', 'Starchy foods provide energy. Protein foods, vegetables, and dairy or suitable alternatives contribute different nutrients. Beans can contribute both protein and fibre.', 'FOOD-002'),
      b('practical', 'Convenience can support access', 'Frozen and tinned fruit or vegetables can contribute. Consider what you can obtain, store and prepare rather than demanding one ideal ingredient.', 'FOOD-006'),
    ],
    practical: [
      b('meal', '1. Begin with a familiar meal', 'Choose something you already enjoy. Identify one change within your control, such as adding an available vegetable option or using beans where they suit the meal and your dietary needs.', 'FOOD-001', 'FOOD-006'),
      b('fibre', '2. Explore a higher-fibre option', 'Examples include a suitable wholegrain staple or pulses in a familiar dish. UK adult guidance gives a daily fibre figure, but food examples can be more useful than counting. A prescribed modified diet takes priority over a general example.', 'FOOD-003', 'FOOD-004'),
      b('access', '3. Work with your resources', 'Check cost, food storage, cooking facilities and assistance. With little time or energy, choose an option that reduces preparation. If food access is the main obstacle, seeking practical support can be the next step.', 'BEH-001'),
      b('review', '4. Review practicality and enjoyment', 'Ask whether the food was available and enjoyable, and what would help next time. You do not need to label a meal good or bad. A specific practical adjustment can be more useful than trying to maximise a slider.', 'BEH-001', 'MODEL-001'),
    ],
    science: [
      b('nutrients', 'Food is more than one nutrient', 'Foods supply combinations of energy, protein, fats, carbohydrates, vitamins and minerals. Food groups organise these patterns for teaching; they are not separate compartments in the body. Adequacy and variety matter alongside moderation.', 'FOOD-002', 'FOOD-001'),
      b('bowel', 'What fibre evidence can tell us', 'Fibre supports bowel function. A major synthesis found that higher fibre intake was associated with better long-term outcomes, while trials supported improvements in some intermediate outcomes. Disease associations and trial changes in blood pressure or cholesterol should be explained separately.', 'FOOD-003'),
      b('comparison', 'The comparison matters', 'Adding a food, replacing another food and changing an entire dietary pattern are different questions. Evidence about one Mediterranean-style intervention cannot establish that one ingredient guarantees protection. An older Cochrane review found varying certainty and few trials with clinical endpoints.', 'FOOD-005'),
      b('measurement', 'How dietary effects are studied', 'Researchers may assess reported food intake, blood markers or disease events over time. Reports of intake can be imperfect; intermediate markers are not the same as clinical outcomes. A percentage entered in the Explorer assesses none of these.', 'FOOD-003', 'FOOD-005', 'MODEL-001'),
      b('connection', 'Eating and sleep can interact', 'In a short trial of selected adults with overweight who habitually slept too little, a sleep-extension intervention affected energy intake. That finding does not justify prescribing extra sleep as a universal weight-loss method.', 'LINK-002'),
    ],
    faqs: [
      b('each-meal', 'Must every meal match a diagram?', 'No. The NHS Eatwell Guide considers balance across the day or week. Other named frameworks organise foods differently; do not combine them into a new score.', 'FOOD-001'),
      b('processed', 'Are all processed foods equivalent?', 'No. Processing alone does not describe the nutrients, quantities or suitability of a food. Frozen and tinned options can be useful parts of balanced eating.', 'FOOD-006'),
      b('carbs', 'Are carbohydrates inherently unhealthy?', 'The category contains varied foods. Research on fibre and whole grains supports paying attention to quality rather than treating the category as one harmful ingredient.', 'FOOD-003'),
    ],
    safety: b('safety', 'General guidance sometimes needs adapting', 'Keep following advice for allergies or medical and special dietary requirements. Ask a registered dietitian or an appropriate local professional when general food guidance does not fit your care. This library does not prescribe calorie restriction, supplements or a therapeutic diet.', 'FOOD-001'),
    glossary: [{ term: 'Fibre', meaning: 'A component of plant foods that supports bowel function.' }, { term: 'Intermediate outcome', meaning: 'A measured marker, such as cholesterol, rather than a later disease event.' }, { term: 'Dietary pattern', meaning: 'The combination of foods and drinks consumed over time.' }],
    diagram: { title: 'A food pattern supplies overlapping needs', description: 'Three labelled boxes describe energy, building materials and varied nutrients. They overlap conceptually: no food belongs to only one function. This is not a plate-proportion or portion-size prescription.', labels: ['Energy', 'Building materials', 'Varied nutrients'], claimIds: ['FOOD-002'] },
    quiz: { question: 'What can a whole-food percentage tell you?', options: ['Whether you meet every nutrient need.', 'Your personal metabolic health.', 'Only the selected illustration setting; it is not a validated diet assessment.'], answer: 2, explanation: 'The setting does not measure intake or adequacy. Food patterns and individual requirements need context.', claimIds: ['FOOD-006', 'MODEL-001'] },
    video: { objective: 'Explain food-pattern balance without a diet score.', scenes: [
      { seconds: 12, visual: 'Several culturally varied meals shown equally; no good/bad labels.', narration: 'Balanced eating concerns a pattern across meals. Start with food you enjoy, can obtain and can prepare.', claimIds: ['FOOD-001'] },
      { seconds: 12, visual: 'Static food-function diagram with labels and a plain-text alternative.', narration: 'Foods provide overlapping combinations of energy and nutrients. A food-group diagram is a teaching tool, not a test of one meal.', claimIds: ['FOOD-002', 'FOOD-001'] },
      { seconds: 12, visual: 'A familiar dish, an affordable vegetable option and optional pulses.', narration: 'Choose a practical change that fits your needs. Frozen or tinned options can contribute; a specialist product is not required by this example.', claimIds: ['FOOD-006'] },
      { seconds: 12, visual: 'Text about dietary requirements, source credits and draft status.', narration: 'General guidance may need adapting for individual requirements. The Explorer percentage does not assess nutrient intake or replace appropriate dietary advice.', claimIds: ['FOOD-001', 'MODEL-001'] },
    ] },
  },
  {
    id: 'sleep', title: 'Sleep: understand timing, opportunity and support',
    subtitle: 'Daily rhythms, routines and when general tips are not enough',
    summary: b('summary', 'Sleep in a minute', 'Sleep health includes enough opportunity to sleep, suitable timing and how you function during the day. Needs vary with age and circumstances. A routine can help organise sleep, but persistent difficulties deserve support rather than a more demanding checklist.', 'SLEEP-001', 'SLEEP-002', 'SLEEP-006'),
    takeaways: [
      b('duration', 'Duration is part of the picture', 'How rested and alert you feel matters alongside hours. A brighter illustration cannot establish sleep quality.', 'SLEEP-001', 'MODEL-001'),
      b('timing', 'Timing has biology behind it', 'Daily body clocks and accumulating sleep pressure interact. Light provides timing cues, and people differ in their natural patterns.', 'SLEEP-003'),
      b('support', 'Tips and treatment are different', 'General sleep habits are not the same as structured cognitive behavioural therapy for insomnia, often called CBT-I.', 'SLEEP-004'),
    ],
    practical: [
      b('opportunity', '1. Look at your actual sleep opportunity', 'Consider work, caring and household routines. Choose a change within your control rather than assuming everyone can keep the same clock time. For shifts, organise ideas around the main sleep period.', 'SLEEP-005'),
      b('surroundings', '2. Choose one environmental adjustment', 'Think about noise, light and comfort. An achievable adjustment or a conversation about interruptions may be more practical than a long list of purchases.', 'SLEEP-001', 'BEH-001'),
      b('routine', '3. Make room for a quiet transition', 'Choose a quiet activity before your main rest. Notice whether late caffeine or other routines affect you. The aim is a useful routine, not a perfect ritual that you must complete before sleeping.', 'SLEEP-001'),
      b('review', '4. Notice daytime functioning', 'Ask whether the change fits your circumstances and how you function during the day. If difficulties persist or make daily life hard to cope with, seek appropriate assessment. Do not keep adding self-help rules indefinitely.', 'SLEEP-001', 'SLEEP-006'),
    ],
    science: [
      b('pressure', 'Two processes help organise sleep', 'Sleep pressure tends to build with time awake. Daily biological clocks help organise periods of sleepiness and wakefulness. Think of accumulating need and a daily timetable: a simplified comparison, not a literal tank or on/off switch.', 'SLEEP-003'),
      b('clock', 'Light is a timing cue', 'Environmental light helps coordinate body clocks. People differ in their preferred timing. This explains why timing matters, but does not justify a universal light-treatment schedule or assume that every person can control their environment.', 'SLEEP-003'),
      b('cbti', 'What CBT-I evidence actually supports', 'CBT-I is a multicomponent treatment addressing thoughts and behaviours that maintain insomnia. Trial reviews support improved insomnia outcomes, including in studied chronic-disease populations. Healthcrest does not deliver assessed CBT-I. Do not turn individual treatment components into instructions from a slider.', 'SLEEP-004'),
      b('measurement', 'How sleep is measured', 'Studies use sleep diaries, symptom questionnaires and objective recording methods. These measure different aspects of sleep. The duration selected in an educational scenario measures none of them and cannot diagnose a sleep disorder.', 'SLEEP-004', 'LINK-001', 'MODEL-001'),
      b('connection', 'Sleep connects with activity and eating', 'Exercise trials support improvements in some sleep outcomes. A separate short sleep-extension trial affected energy intake in a selected group. These findings concern different interventions and populations; they do not establish one combined formula or guarantee.', 'LINK-001', 'LINK-002'),
    ],
    faqs: [
      b('eight', 'Is eight hours compulsory?', 'No. Population recommendations use ranges or minimums and different age bands. They are not diagnostic tests for an individual.', 'SLEEP-001', 'SLEEP-002'),
      b('shift', 'What if I work nights or care for someone?', 'Start with your actual sleep opportunity. A cue before your main rest may fit better than an assumed evening bedtime. Structural interruptions may require practical support.', 'SLEEP-005', 'BEH-001'),
      b('cure', 'Will a wind-down routine cure insomnia?', 'Not reliably. Persistent insomnia may require assessment and structured treatment. General tips and CBT-I should not be presented as equivalent.', 'SLEEP-004', 'SLEEP-006'),
    ],
    safety: b('safety', 'Persistent difficulties deserve assessment', 'Do not drive when sleepy. Seek professional advice when sleep problems persist, affect daily life, or do not improve with general habit changes. This site cannot identify the cause, assess sleep breathing or recommend medication changes.', 'SLEEP-006'),
    glossary: [{ term: 'Circadian', meaning: 'Related to roughly daily biological rhythms.' }, { term: 'Sleep pressure', meaning: 'The tendency to become sleepier as time awake accumulates.' }, { term: 'CBT-I', meaning: 'Cognitive behavioural therapy for insomnia: structured treatment, not simply a checklist of sleep tips.' }],
    diagram: { title: 'Sleep pressure and body-clock timing interact', description: 'Two labelled inputs, accumulating sleep pressure and daily body-clock timing, contribute to sleepiness and wakefulness. The diagram is conceptual: it has no personal data, predicted bedtime or numerical scale.', labels: ['Sleep pressure', 'Body-clock timing', 'Sleep and wakefulness'], claimIds: ['SLEEP-003'] },
    quiz: { question: 'What does a selected sleep duration establish?', options: ['Sleep stages and recovery.', 'A scenario value; sleep quality and persistent problems need other information.', 'Whether someone needs treatment.'], answer: 1, explanation: 'A scenario duration is not a measurement or diagnosis. Age, functioning and symptoms need context.', claimIds: ['SLEEP-001', 'MODEL-001'] },
    video: { objective: 'Explain two sleep-regulation processes without prescribing treatment.', scenes: [
      { seconds: 12, visual: 'Two labelled inputs; no anatomical claims or brain-clearance animation.', narration: 'Sleep pressure builds with time awake. Body-clock timing also helps organise sleepiness and wakefulness. The processes interact.', claimIds: ['SLEEP-003'] },
      { seconds: 12, visual: 'Different work and caring routines with equal visual weight.', narration: 'People differ in their timing and opportunities to sleep. Choose a practical routine around your actual rest period.', claimIds: ['SLEEP-003', 'SLEEP-005'] },
      { seconds: 12, visual: 'Duration, daytime function and comfort shown as distinct labelled cards.', narration: 'Hours are part of the picture. How you function during the day also matters. A selected duration does not measure sleep quality.', claimIds: ['SLEEP-001', 'MODEL-001'] },
      { seconds: 12, visual: 'Assessment/support text and original source credits; no treatment demonstration.', narration: 'Persistent difficulties deserve assessment. General sleep tips are not the same as structured treatment for insomnia. Do not drive when sleepy.', claimIds: ['SLEEP-004', 'SLEEP-006'] },
    ] },
  },
  {
    id: 'stress', title: 'Stress and support: understand pressures and options',
    subtitle: 'Practical help, connection and optional coping skills',
    summary: b('summary', 'Stress in a minute', 'Stress is a response to demands or difficult circumstances. A useful next step can involve practical help, changing a situation, rest, connection or a coping activity. Responses differ. Looking after yourself does not require eliminating every stressful feeling.', 'STRESS-001', 'STRESS-005'),
    takeaways: [
      b('response', 'Stress involves mind and body', 'Short-term responses can support action. Stress can also affect tension, mood, sleep, appetite and behaviour. These symptoms do not diagnose their own cause.', 'STRESS-001'),
      b('choice', 'There is more than one coping option', 'Gentle comfortable breathing is optional. A practical change or conversation can also be a useful next step.', 'STRESS-002', 'STRESS-005'),
      b('context', 'Circumstances matter', 'Workload, money, relationships and available support affect what is possible. Coping skills do not remove the need to address pressures.', 'STRESS-005'),
    ],
    practical: [
      b('pressure', '1. Name a pressure without judging yourself', 'Identify one situation making life harder. Consider whether it needs a practical change, support, a boundary or time to recover. Not every pressure can be solved by an individual habit.', 'STRESS-005'),
      b('support', '2. Choose a route that fits', 'You might speak with someone appropriate, ask for practical assistance or prioritise one task. A smaller action or arranging support can be a complete next step.', 'STRESS-005', 'BEH-001'),
      b('breathing', '3. Try a coping activity only if it suits you', 'If you choose the NHS breathing practice, follow its full instructions: gentle, regular breathing without forcing. You can choose another comfortable activity. Do not substitute forceful breathing or breath-holding instructions.', 'STRESS-002'),
      b('review', '4. Review support as well as technique', 'Ask what helped and whether more support or a change to the situation is needed. If coping remains difficult, seek appropriate professional support rather than assuming you need more practice.', 'STRESS-005'),
    ],
    science: [
      b('response-system', 'A response that prepares for action', 'During stress, adrenaline contributes to changes that support alertness and action. People experience different physical and emotional responses. A subjective rating cannot establish adrenaline, cortisol or nervous-system balance, and symptoms may have other causes.', 'STRESS-001', 'MODEL-001'),
      b('breath-evidence', 'Why breathing claims need qualification', 'A review of small trials found lower self-reported stress with breathwork compared with some controls. A later trial with a credible breathing comparison found no detectable extra benefit from its coherent-breathing method. The studies address different comparisons. They do not justify a guaranteed nervous-system reset.', 'STRESS-003'),
      b('mindfulness', 'What mindfulness research measures', 'A recent review supports improvements in perceived stress in non-clinical adults. Programmes and comparisons vary, and a structured programme is not the same as a brief app prompt. Perceived stress is a reported experience, not proof of changes in inflammatory markers or disease risk.', 'STRESS-004'),
      b('context-science', 'Supportive environments belong in the explanation', 'Practical pressures and social support affect coping. For adolescents, supportive family, school and community environments are particularly important. Education should not turn structural difficulties into a failure of motivation.', 'STRESS-005', 'TEEN-001'),
      b('connection', 'Stress can affect other routines', 'Stress may disturb sleep or change appetite and activity. That makes the habits useful to discuss together. It does not mean stress explains every symptom or that adjusting one habit repairs all the others.', 'STRESS-001', 'MODEL-001'),
    ],
    faqs: [
      b('all-bad', 'Is all stress harmful?', 'No. Short-term stress can sometimes support action. The circumstances, persistence and effect on daily life matter.', 'STRESS-001'),
      b('must-breathe', 'Must I meditate or practise breathing?', 'No. These are choices rather than requirements. Practical help, connection and appropriate care can matter more in a particular situation.', 'STRESS-002', 'STRESS-005'),
      b('rating', 'Does a low rating show healthy hormone levels?', 'No. A rating describes a chosen or reported experience. Healthcrest does not measure hormones or establish a diagnosis.', 'MODEL-001'),
    ],
    safety: b('safety', 'Support should remain easy to find', 'If you are struggling to cope or daily functioning is affected, seek suitable professional support. If you need urgent help, use local urgent services. For teenagers, involve a trusted adult or appropriate local professional. General coping education does not replace care.', 'STRESS-005', 'TEEN-001'),
    glossary: [{ term: 'Adrenaline', meaning: 'A hormone involved in preparing the body for action.' }, { term: 'Perceived stress', meaning: 'How a person reports experiencing stress; not a direct hormone measurement.' }, { term: 'Active comparison', meaning: 'A comparison group given another credible activity rather than no intervention.' }],
    diagram: { title: 'Several routes can support coping', description: 'Three equal labelled boxes show practical changes, connection and optional coping skills. They are alternatives or complements, not a hierarchy or a nervous-system reset sequence.', labels: ['Practical changes', 'Connection', 'Optional coping skills'], claimIds: ['STRESS-002', 'STRESS-005'] },
    quiz: { question: 'What does feeling calmer after a breathing practice prove?', options: ['That hormones have normalised.', 'That the method works for everyone.', 'A useful personal experience, without proving a particular physiological change.'], answer: 2, explanation: 'A reported experience and a measured biological outcome are different. Trial findings also depend on the comparison used.', claimIds: ['STRESS-003', 'MODEL-001'] },
    video: { objective: 'Offer coping choices without promising a physiological reset.', scenes: [
      { seconds: 12, visual: 'Everyday pressures named without blaming the person.', narration: 'Stress is a response to demands or difficult circumstances. People respond differently, and circumstances affect what is possible.', claimIds: ['STRESS-001', 'STRESS-005'] },
      { seconds: 12, visual: 'Three equal static support routes matching the diagram.', narration: 'A next step might be practical help, connection or a coping activity. You do not have to choose the same option as someone else.', claimIds: ['STRESS-005'] },
      { seconds: 12, visual: 'Comfortable posture; link to full NHS instructions; no breath-hold countdown.', narration: 'Gentle breathing is optional. Follow comfortable, unforced instructions if you try it. Research does not establish a guaranteed nervous-system reset.', claimIds: ['STRESS-002', 'STRESS-003'] },
      { seconds: 12, visual: 'Local professional and trusted-adult support text plus source credits.', narration: 'Persistent difficulties deserve appropriate support. These illustrations do not measure hormones, diagnose symptoms or replace professional care.', claimIds: ['STRESS-005', 'MODEL-001'] },
    ] },
  },
];

export const getLesson = (id: unknown) => typeof id === 'string' ? LESSONS.find(lesson => lesson.id === id) : undefined;
