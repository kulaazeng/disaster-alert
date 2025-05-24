interface USGSData {
    type: string;
    metadata: Metadata;
    features: Feature[];
  }
  
  interface Feature {
    type: string;
    properties: Properties;
    geometry: Geometry;
    id: string;
  }
  
  interface Geometry {
    type: string;
    coordinates: number[];
  }
  
  interface Properties {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz: null;
    url: string;
    detail: string;
    felt: null;
    cdi: null;
    mmi: null;
    alert: null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number;
    dmin: number;
    rms: number;
    gap: number;
    magType: string;
    type: string;
    title: string;
  }
  
  interface Metadata {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  }