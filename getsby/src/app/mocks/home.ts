import type { ConcertEvent, FooterData, HeaderData, Locale, MainData, ProgramCategory } from "../types/home";

const asset = (name: string) => `/concert-assets/${name}`;

const eventImages = [
  "014-ca4eb42c.webp",
  "015-6784361a.webp",
  "016-b3ff05e4.webp",
  "020-650ae7cf.webp",
  "021-04673a88.webp",
  "022-7e8a2dea.webp",
  "026-9f6ad9a8.webp",
  "027-2ea494a0.webp",
  "028-49a5bc70.webp",
  "032-d5eabbd0.webp",
  "033-fb5831c5.webp",
  "034-226b3fcd.webp",
  "038-161a9b52.webp",
  "039-a66199c2.webp",
  "044-c3d3e6d1.webp",
  "045-e9baea69.webp",
  "046-040233a5.webp",
  "050-3284e513.webp",
];

const ruEvents = [
  ["Концерт «Музыка для фортепиано и кларнета»", "Образовательная программа «Музыкально-исполнительское искусство»"],
  ["Концерт «Музыка для скрипки и виолончели»", "Сочинения Брамса, Равеля и Шостаковича"],
  ["Концерт «Музыка для валторны, тромбона, тубы и ударных инструментов»", "Молодые музыканты фестиваля на сцене Камерного зала"],
  ["Вечер камерной музыки", "Ансамбли участников фестиваля «Сириус — Роза Хутор»"],
  ["Симфонический концерт", "Оркестровые шедевры XX века"],
  ["Парад юношеских оркестров", "Гала-концерт с участием Юрия Башмета"],
  ["Музыкальная сборная России", "Новые имена на главной сцене Концертного центра"],
  ["Концерт солистов Санкт-Петербурга", "Русская и европейская классика"],
  ["Фортепианный вечер", "Произведения Рахманинова и Дебюсси"],
  ["Музыка без границ", "Международная программа молодых исполнителей"],
  ["Диалоги эпох", "Камерная программа: от барокко до современности"],
  ["Большая симфония", "Фестивальный оркестр под управлением приглашённого дирижёра"],
  ["Шедевры мировой сцены", "Музыкальное путешествие через страны и столетия"],
  ["Открытая репетиция", "Встреча со зрителями и разговор о музыке"],
  ["Мастерская ансамбля", "Практикум артистов и молодых музыкантов"],
  ["Лекция-концерт «Как слушать классику»", "Просветительская программа для всей семьи"],
  ["Музыка и архитектура", "Разговор об акустике нового концертного центра"],
  ["Финальный концерт фестиваля", "Лучшие участники летней программы на одной сцене"],
] as const;

const enEvents = [
  ["Piano and Clarinet Music", "Music Performance educational programme"],
  ["Music for Violin and Cello", "Works by Brahms, Ravel and Shostakovich"],
  ["Music for Brass and Percussion", "Young festival musicians on the Chamber Hall stage"],
  ["An Evening of Chamber Music", "Ensembles of the Sirius — Rosa Khutor festival"],
  ["Symphonic Concert", "Orchestral masterpieces of the 20th century"],
  ["Youth Orchestras Parade", "Gala concert featuring Yuri Bashmet"],
  ["Russian National Music Team", "New names on the Concert Centre main stage"],
  ["St Petersburg Soloists", "Russian and European classics"],
  ["Piano Recital", "Works by Rachmaninoff and Debussy"],
  ["Music Without Borders", "International programme for young performers"],
  ["Dialogues Across Time", "From baroque to contemporary chamber music"],
  ["The Grand Symphony", "Festival orchestra and guest conductor"],
  ["World Stage Masterpieces", "A musical journey through countries and centuries"],
  ["Open Rehearsal", "Meet the musicians and talk about music"],
  ["Ensemble Workshop", "A practical session for artists and young musicians"],
  ["How to Listen to Classics", "An educational concert for the whole family"],
  ["Music and Architecture", "A conversation about the acoustics of the new venue"],
  ["Festival Finale", "The brightest talents of the summer programme on one stage"],
] as const;

const eventMeta = [
  ["19.08.2026", "16:30", "Камерный зал"], ["20.08.2026", "16:30", "Камерный зал"],
  ["21.08.2026", "16:30", "Камерный зал"], ["22.08.2026", "14:00", "Камерный зал"],
  ["22.08.2026", "18:00", "Главная сцена"], ["23.08.2026", "18:00", "Главная сцена"],
  ["24.08.2026", "19:00", "Главная сцена"], ["25.08.2026", "19:00", "Главная сцена"],
  ["27.08.2026", "19:00", "Камерный зал"], ["05.09.2026", "19:00", "Камерный зал"],
  ["12.09.2026", "19:00", "Камерный зал"], ["16.09.2026", "19:00", "Камерный зал"],
  ["28.09.2026", "19:00", "Главная сцена"], ["14.10.2026", "19:00", "Камерный зал"],
  ["02.11.2026", "19:00", "Главная сцена"], ["15.11.2026", "15:00", "Камерный зал"],
  ["29.11.2026", "15:00", "Камерный зал"], ["12.12.2026", "19:00", "Главная сцена"],
] as const;

function createEvents(locale: Locale): ConcertEvent[] {
  const copy = locale === "ru" ? ruEvents : enEvents;
  return copy.map(([title, program], index) => ({
    id: `event-${index + 1}`,
    title,
    program,
    description: locale === "ru"
      ? "В программе — произведения русских и зарубежных композиторов. Участники фестиваля представят новую концертную программу, созданную специально для пространства Концертного центра «Сириус»."
      : "The programme brings together Russian and international composers. Festival artists present a new concert created especially for the Sirius Concert Centre.",
    venue: locale === "ru" ? eventMeta[index][2] : eventMeta[index][2] === "Главная сцена" ? "Main Stage" : "Chamber Hall",
    date: eventMeta[index][0],
    time: eventMeta[index][1],
    age: "6+",
    image: asset(eventImages[index]),
  }));
}

function createCategories(locale: Locale, events: ConcertEvent[]): ProgramCategory[] {
  const ru = [
    ["Международный фестиваль искусств для детей и молодёжи «Сириус — Роза Хутор»", "1.06—31.08 2026"],
    ["Музыкальная сборная России", "3.09—18.11 2026"],
    ["Концерты сезона", "1.09—22.12 2026"],
    ["Мастера музыки", "3.09—19.11 2026"],
    ["Просветительские мероприятия", "29.04—24.12 2026"],
  ] as const;
  const en = [
    ["Sirius — Rosa Khutor International Arts Festival for Children and Young People", "1 Jun—31 Aug 2026"],
    ["Russian National Music Team", "3 Sep—18 Nov 2026"],
    ["Season Concerts", "1 Sep—22 Dec 2026"],
    ["Masters of Music", "3 Sep—19 Nov 2026"],
    ["Educational Events", "29 Apr—24 Dec 2026"],
  ] as const;
  const copy = locale === "ru" ? ru : en;
  const categoryImages = [
    "012-d5754eb2.webp", "035-4dab88ea.webp", "010-ec0e4158.webp", "057-cb7caf8c.webp", "062-bfd31ba2.webp",
  ];
  const ranges = [[0, 6], [6, 9], [9, 12], [12, 15], [15, 18]] as const;

  return copy.map(([title, period], index) => ({
    id: ["festival", "team", "season", "masters", "education"][index],
    title,
    period,
    image: asset(categoryImages[index]),
    events: events.slice(...ranges[index]),
  }));
}

export function getHeaderMock(locale: Locale): HeaderData {
  const isRu = locale === "ru";

  return {
    location: isRu
      ? "Федеральная территория «Сириус»\nулица Чемпионов, 5"
      : "Sirius Federal Territory\n5 Chempionov Street",
    logo: asset("008-dc7f22d8.svg"),
    navigation: [
      { id: "programme", label: isRu ? "Афиша" : "Programme", href: "#programme" },
      { id: "mission", label: isRu ? "О центре" : "About", href: "#mission" },
      { id: "architecture", label: isRu ? "Архитектура" : "Architecture", href: "#architecture" },
      { id: "contacts", label: isRu ? "Контакты" : "Contacts", href: "#contacts" },
    ],
  };
}

export function getMainMock(locale: Locale): MainData {
  const events = createEvents(locale);
  const isRu = locale === "ru";

  return {
    heroSlides: [
      {
        id: "orchestras",
        title: isRu ? "Парад юношеских оркестров" : "Youth Orchestras Parade",
        description: isRu
          ? "Четыре вечера, восемь оркестров и сотни молодых музыкантов из разных стран. Финальный концерт объединит два коллектива, напрямую связанных с инициативами Юрия Башмета."
          : "Four evenings, eight orchestras and hundreds of young musicians from around the world. The finale brings together two ensembles connected with Yuri Bashmet's initiatives.",
        image: asset("009-9125b792.webp"),
      },
      {
        id: "architecture",
        title: isRu ? "Неповторимая архитектура" : "Remarkable Architecture",
        description: isRu
          ? "Органика форм и объёмов Концертного центра вторит горному ландшафту и создаёт новое культурное пространство."
          : "The organic forms and volumes of the Concert Centre echo the mountain landscape and create a new cultural space.",
        image: asset("010-ec0e4158.webp"),
      },
      {
        id: "academy",
        title: isRu ? "Музыка, которая объединяет" : "Music That Brings Us Together",
        description: isRu
          ? "На одной сцене встречаются признанные мастера и молодые исполнители. Здесь рождаются новые фестивальные традиции."
          : "Acclaimed masters and young performers meet on one stage, creating new festival traditions.",
        image: asset("013-9a9dd0a9.webp"),
      },
    ],
    categories: createCategories(locale, events),
    mission: {
      title: isRu ? "Большая миссия" : "A Greater Mission",
      paragraphs: isRu
        ? [
            "Концертный центр «Сириус» — знаковое культурное пространство в России, сцена для масштабных фестивалей и выступлений лучших исполнителей.",
            "Это творческая лаборатория для экспериментов и мастерская для классики.",
          ]
        : [
            "The Sirius Concert Centre is a landmark cultural venue in Russia and a stage for major festivals and world-class performers.",
            "It is a creative laboratory for experimentation and a workshop for the classics.",
          ],
      greetingLabel: isRu ? "Приветственное слово" : "Welcome address",
      greetingName: isRu ? "Е. В. Шмелевой," : "Elena Shmeleva,",
      greetingRole: isRu
        ? "руководителя Образовательного Фонда «Талант и успех»"
        : "Head of the Talent and Success Educational Foundation",
    },
    experience: {
      architecturePrefix: isRu ? "Неповторимая" : "Remarkable",
      architecture: isRu ? "Архитектура" : "Architecture",
      architectureText: isRu
        ? "Органика форм и объёмов Концертного центра вторит природному рельефу и становится его продолжением."
        : "The organic forms and volumes of the Concert Centre echo the natural landscape and become its continuation.",
      acousticsPrefix: isRu ? "Безупречная" : "Impeccable",
      acoustics: isRu ? "Акустика" : "Acoustics",
      acousticsText: isRu
        ? "Темп и ритм нашли себя не только в геометрии архитектурных форм, но и в акустике. Все пространства подчинены высокой музыкальной культуре."
        : "Tempo and rhythm live not only in the geometry of the architecture but also in the acoustics. Every space serves a refined musical culture.",
      halls: isRu ? "Две сцены — одно пространство музыки" : "Two stages — one space for music",
      mainHall: isRu ? "Главная сцена" : "Main Stage",
      chamberHall: isRu ? "Камерный зал" : "Chamber Hall",
    },
  };
}

export function getFooterMock(locale: Locale): FooterData {
  const isRu = locale === "ru";

  return {
    contacts: {
      title: isRu ? "Контакты" : "Contacts",
      address: isRu
        ? "Федеральная территория «Сириус», улица Чемпионов, 5"
        : "Sirius Federal Territory, 5 Chempionov Street",
      ticketOfficeLabel: isRu ? "Билетная система, обратная связь" : "Ticket service and feedback",
      ticketPhone: "8 (862) 241-98-44",
      socials: ["telegram", "vk", "youtube"],
    },
    additional: {
      title: isRu ? "Дополнительная информация" : "Additional information",
      links: isRu
        ? ["Правила посещения Концертного центра «Сириус»", "Публичная оферта", "Уполномоченные организации по реализации билетов"]
        : ["Rules for visiting the Sirius Concert Centre", "Public offer", "Authorised ticket sales organisations"],
    },
    council: {
      title: isRu ? "Художественно-экспертный совет" : "Artistic Advisory Board",
      text: isRu
        ? "Глава совета: народный артист Российской Федерации, профессор С. П. Ролдугин — художественный руководитель Санкт-Петербургского Дома музыки"
        : "Chairman: People's Artist of Russia, Professor Sergei Roldugin, Artistic Director of the St Petersburg Music House",
      membersLabel: isRu ? "Состав совета" : "Board members",
    },
    partnership: {
      title: isRu ? "Сотрудничество, предложения" : "Partnership and proposals",
      email: "concert@sirius.online",
      audienceLabel: isRu ? "Дирекция по работе со зрителями и продвижению" : "Audience relations and promotion",
      phone: "8 (862) 241-98-44",
      audienceEmail: "pavlova.ds@talantiuspeh.ru",
    },
    newsTitle: isRu ? "Новости" : "News",
    news: [
      { id: "n1", title: isRu ? "Летний фестиваль объединил молодых музыкантов из разных стран" : "Summer festival brought together young musicians from around the world", date: "12.08.2026" },
      { id: "n2", title: isRu ? "Новый концертный сезон откроется симфонической программой" : "The new season opens with a symphonic programme", date: "05.08.2026" },
      { id: "n3", title: isRu ? "Гастроли и полные залы: коллектив завершил выступления в Сириусе" : "A visiting ensemble completes its sold-out Sirius tour", date: "29.07.2026" },
      { id: "n4", title: isRu ? "От Глинки до Брамса: второй вечер фестиваля" : "From Glinka to Brahms: the festival's second evening", date: "27.07.2026" },
    ],
    finale: {
      title: isRu ? "Природа искусства" : "The nature of art",
      year: 2026,
      rights: isRu ? "Все права защищены" : "All rights reserved",
    },
  };
}
