export interface CountryLanguage {
  name: string;
  iso639_1: string | null;
  iso639_2: string;
  nativeName: string;
}

export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface Country {
  name: string;
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
  capital?: string | null;
  region: string;
  subregion?: string | null;
  population: number;
  area: number;
  currencies?: CountryCurrency[];
  languages: CountryLanguage[];
  alpha2Code: string;
  alpha3Code: string;
  latlng: number[];
}
