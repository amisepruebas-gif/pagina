import type { Timestamp } from 'firebase/firestore';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RawBase {
  name?: string;
  slug?: string;
  active?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface RawTagDoc extends RawBase {
  color?: string;
}

export interface RawMaterialDoc extends RawBase {
  description?: string;
}

export interface RawSubcategoryDoc extends RawBase {
  categoryId?: string;
  description?: string;
  order?: number;
}
