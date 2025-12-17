drop table if exists public.communities;
create table public.communities (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  description text not null,

  feature_name text not null,
  feature_description text not null,

  created_at timestamptz not null default now()
);

insert into public.communities (
  slug,
  name,
  description,
  feature_name,
  feature_description
) values
(
  'highborne',
  'Highborne',
  'Being part of a highborne community means you’re accustomed to a life of elegance, opulence, and prestige within the upper echelons of society. Traditionally, members of a highborne community possess incredible material wealth. While this can take a variety of forms depending on the community—including gold and other minerals, land, or controlling the means of production—this status always comes with power and influence. Highborne place great value on titles and possessions, and there is little social mobility within their ranks. Members of a highborne community often control the political and economic status of the areas in which they live due to their ability to influence people and the economy with their substantial wealth. The health and safety of less affluent people who live in those locations often hinges on the ability of this highborne ruling class to prioritize the well-being of their subjects over profit.',
  'Privilege',
  'You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want.'
),
(
  'loreborne',
  'Loreborne',
  'Being part of a loreborne community means you’re from a society that favors strong academic or political prowess. Loreborne communities highly value knowledge, frequently in the form of historical preservation, political advancement, scientific study, skill development, or lore and mythology compilation. Most members of these communities research in institutions built in bastions of civilization, while some eclectic few thrive in gathering information from the natural world. Some may be isolationists, operating in smaller enclaves, schools, or guilds and following their own unique ethos. Others still wield their knowledge on a larger scale, making deft political maneuvers across governmental landscapes.',
  'Well-Read',
  'You have advantage on rolls that involve the history, culture, or politics of a prominent person or place.'
),
(
  'orderborne',
  'Orderborne',
  'Being part of an orderborne community means you’re from a collective that focuses on discipline or faith, and you uphold a set of principles that reflect your experience there. Orderborne are frequently some of the most powerful among the surrounding communities. By aligning the members of their society around a common value or goal, such as a god, doctrine, ethos, or even a shared business or trade, the ruling bodies of these enclaves can mobilize larger populations with less effort. While orderborne communities take a variety of forms—some even profoundly pacifistic—perhaps the most feared are those that structure themselves around military prowess.',
  'Dedicated',
  'Record three sayings or values your upbringing instilled in you. Once per rest, when you describe how you’re embodying one of these principles through your current action, you can roll a d20 as your Hope Die.'
),
(
  'ridgeborne',
  'Ridgeborne',
  'Being part of a ridgeborne community means you’ve called the rocky peaks and sharp cliffs of the mountainside home. Those who’ve lived in the mountains often consider themselves hardier than most because they’ve thrived among the most dangerous terrain many continents have to offer. These groups are adept at adaptation, developing unique technologies and equipment to move both people and products across difficult terrain. Ridgeborne grow up scrambling and climbing, making them sturdy and strong-willed.',
  'Steady',
  'You have advantage on rolls to traverse dangerous cliffs and ledges, navigate harsh environments, and use your survival knowledge.'
),
(
  'seaborne',
  'Seaborne',
  'Being part of a seaborne community means you lived on or near a large body of water. Seaborne communities are built, both physically and culturally, around the specific waters they call home. Some live along the shore, constructing ports for locals and travelers alike, while others live on the water in small boats or large ships. No matter their exact location, seaborne communities are closely tied to the ocean tides and the creatures who inhabit them.',
  'Know the Tide',
  'When you roll with Fear, place a token on your community card. You can hold a number of tokens equal to your level. Before you make an action roll, you can spend any number of these tokens to gain a +1 bonus to the roll for each token spent. At the end of each session, clear all unspent tokens.'
),
(
  'slyborne',
  'Slyborne',
  'Being part of a slyborne community means you come from a group that operates outside the law, including all manner of criminals, grifters, and con artists. Members of slyborne communities are brought together by their disparate goals and their clever means of achieving them. Though they may appear disloyal from the outside, these communities possess some of the strictest codes of honor.',
  'Scoundrel',
  'You have advantage on rolls to negotiate with criminals, detect lies, or find a safe place to hide.'
),
(
  'underborne',
  'Underborne',
  'Being part of an underborne community means you’re from a subterranean society. Many underborne live right beneath the cities and villages of other collectives, while some live much deeper. These communities range from small groups in burrows to massive metropolises in caverns of stone. Underborne are recognized for their boldness, engineering skill, and ability to survive dangerous belowground environments.',
  'Low-Light Living',
  'When you’re in an area with low light or heavy shadow, you have advantage on rolls to hide, investigate, or perceive details within that area.'
),
(
  'wanderborne',
  'Wanderborne',
  'Being part of a wanderborne community means you’ve lived as a nomad, forgoing a permanent home and experiencing a wide variety of cultures. Wanderborne are defined by their traveling lifestyle and place less value on material possessions in favor of information, skills, and connections. The dangers of life on the road foster deep loyalty among these groups.',
  'Nomadic Pack',
  'Add a Nomadic Pack to your inventory. Once per session, you can spend a Hope to pull out a mundane item useful to your situation, working with the GM to define it.'
),
(
  'wildborne',
  'Wildborne',
  'Being part of a wildborne community means you lived deep within the forest. Wildborne communities are defined by their dedication to conservation and sustainability, integrating their settlements with the natural environment and avoiding disruption of local flora and fauna.',
  'Lightfoot',
  'Your movement is naturally silent. You have advantage on rolls to move without being heard.'
);
