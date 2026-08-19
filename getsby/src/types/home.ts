export type Locale = "ru" | "en";

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ConcertEvent {
  id: string;
  projectId: string;
  title: string;
  program: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  age: string;
  image: string;
}

export interface ProgramCategory {
  id: string;
  title: string;
  period: string;
  image: string;
  events: ConcertEvent[];
}

export interface MissionContent {
  title: string;
  paragraphs: string[];
  greetingLabel: string;
  greetingName: string;
  greetingRole: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderData {
  homeHref: string;
  location: string;
  logo: string;
  navigation: NavigationItem[];
}

export interface ExperienceContent {
  architecturePrefix: string;
  architecture: string;
  architectureText: string;
  acousticsPrefix: string;
  acoustics: string;
  acousticsText: string;
  halls: string;
  mainHall: string;
  chamberHall: string;
}

export interface MainData {
  heroSlides: HeroSlide[];
  categories: ProgramCategory[];
  mission: MissionContent;
  experience: ExperienceContent;
}

export interface FooterData {
  contacts: {
    title: string;
    address: string;
    ticketOfficeLabel: string;
    ticketPhone: string;
    socials: string[];
  };
  additional: {
    title: string;
    links: string[];
  };
  council: {
    title: string;
    text: string;
    membersLabel: string;
  };
  partnership: {
    title: string;
    email: string;
    audienceLabel: string;
    phone: string;
    audienceEmail: string;
  };
  newsTitle: string;
  news: NewsItem[];
  finale: {
    title: string;
    year: number;
    rights: string;
  };
}
