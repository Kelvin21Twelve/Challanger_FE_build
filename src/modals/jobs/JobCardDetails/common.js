export const updateCommonJobCardCalculation = (client, calculation) => {
  client.setQueryData(["sync-db", "JobCardsCalculation"], (oldData) => ({
    ...oldData,
    data: oldData?.data?.map((item) =>
      item.job_id == calculation?.job_id ? calculation : item,
    ),
  }));
};
