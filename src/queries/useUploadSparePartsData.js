import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { uploadNewSparePartsExcelEndpoint } from "./endpoints";

export function useUploadSparePartsData() {
  return useMutation({
    mutationKey: ["upload-spare-parts-excel-data"],
    mutationFn: async (payload) => {
      const response = await axios.post(
        uploadNewSparePartsExcelEndpoint,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response?.data;
    },
  });
}
