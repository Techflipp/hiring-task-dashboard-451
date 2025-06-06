export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://task-451-api.ryd.wafaicloud.com";

export const API_ENDPOINTS = {
  tags: "/tags/",
  cameras: "/cameras/",
  demographics: {
    config: "/demographics/config",
    results: "/demographics/results",
  },
} as const;
