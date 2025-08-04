export interface IGetProjectsResponse {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user?: {
    id: string;
    fullName: string;
  };

  task?: {
    title: string;
    status: string;
  };
}

export interface IBodyProject {
  name: string;
  description?: string;
  userId: string;
}
