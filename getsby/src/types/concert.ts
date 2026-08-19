import type { ConcertEvent } from "./home";

export interface ConcertProject {
  id: string;
  title: string;
  period: string;
}

export interface ConcertPageData {
  project: ConcertProject;
  event: ConcertEvent;
}
