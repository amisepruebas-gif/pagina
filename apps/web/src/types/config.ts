import type { Timestamp } from 'firebase/firestore';

export interface SiteConfig {
  shipping: {
    freeFromMxn: number;
    defaultCostMxn: number;
    carrier?: string;
  };
  branding: {
    siteName: string;
    siteDescription: string;
    accentColor: string;
  };
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    x?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface RawSiteConfigDoc {
  shipping?: Partial<SiteConfig['shipping']>;
  branding?: Partial<SiteConfig['branding']>;
  contact?: Partial<SiteConfig['contact']>;
  social?: Partial<SiteConfig['social']>;
  updatedAt?: Timestamp;
}

export const DEFAULT_CONFIG: SiteConfig = {
  shipping: {
    freeFromMxn: 599,
    defaultCostMxn: 99,
    carrier: 'Skydropx'
  },
  branding: {
    siteName: 'pagina',
    siteDescription: 'pagina',
    accentColor: '#FF69B4'
  },
  contact: {
    email: '',
    phone: '',
    whatsapp: ''
  },
  social: {
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    x: 'https://x.com',
    linkedin: 'https://www.linkedin.com',
    whatsapp: 'https://web.whatsapp.com'
  }
};
