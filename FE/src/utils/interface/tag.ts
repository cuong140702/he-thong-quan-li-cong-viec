export interface IGetTagsResponse {
  id: string;
  name: string;
  deletedAt: Date | null;
}

export interface IBodyTag {
  name: string;
}
