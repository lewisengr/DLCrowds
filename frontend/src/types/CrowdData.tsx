export interface CrowdData {
  rideName: string;
  waitTime: number;
  crowdScore: number;
}

export interface AttractionLiveData {
  id: string;
  name: string;
  entityType: "ATTRACTION";
  status?: string;
  queue?: {
    standby?: {
      waitTime: number;
    };
    STANDBY?: {
      waitTime: number;
    };
  };
}
