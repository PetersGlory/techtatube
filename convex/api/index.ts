import { api as videosApi } from "./videos";
import { api as transcriptsApi } from "./transcripts";
import { api as entitlementsApi } from "./entitlements";
import { api as usageApi } from "./usage";
import { api as analysisApi } from "./analysis";
import { api as generationJobsApi } from "./generationJobs";
import { api as generationsApi } from "./generations";
import { api as contentApi } from "./content";

export const api = {
  videos: videosApi,
  transcripts: transcriptsApi,
  entitlements: entitlementsApi,
  usage: usageApi,
  analysis: analysisApi,
  generationJobs: generationJobsApi,
  generations: generationsApi,
  content: contentApi,
};