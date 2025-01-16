export interface User {
  id: string;
  username: string;
  role: 'resident' | 'consultant';
}

export interface Image {
  url: string;
  type: 'image' | 'video';
  description?: string;
}

export interface Case {
  id: string;
  patientId: string;
  summary: string;
  clinicalFindings: string;
  images: Image[];
  tags: string[];
  externalLinks: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}