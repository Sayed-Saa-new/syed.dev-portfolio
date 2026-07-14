export interface Position {
  title: string;
  description: string[];
}

export interface Experience {
  company: string;
  period: string;
  positions: Position[];
}

export interface Education {
  school: string;
  period: string;
  degree: string;
  description?: string;
}

export interface ResumeData {
  experiences: Experience[];
  education?: Education[];
  avatarUrl: string;
}
