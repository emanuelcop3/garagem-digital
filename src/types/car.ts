export interface Car {
  Name: string;
  Model: string;
  Image: string;
  Price: number;
  Location: string;
  Description: string;
  highlightedName?: string;
  highlightedModel?: string;
  highlightedLocation?: string;
}

export interface CarSearchParams {
  name?: string;
  location?: string;
  maxPrice?: number;
} 