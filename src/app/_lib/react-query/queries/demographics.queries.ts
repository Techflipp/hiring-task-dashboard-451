import { getDemographicsDetails } from '@/server/actions/demographics/demographics.actions';
import { GetDemographicsInput } from '@/server/actions/demographics/demographics.inputs';

// Get a camera details
export const demographicsQueryKey = (params: GetDemographicsInput) => ['demographic', params];

export const demographicsQueryFn = async (params: GetDemographicsInput) => {
  return await getDemographicsDetails(params);
};
