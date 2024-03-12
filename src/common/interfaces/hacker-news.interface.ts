export interface Item {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  text?: string;
  type: string;
  url: string;
}

export interface User {
  about: string;
  delay: number;
  id: string;
  karma: number;
  created: number;
}
