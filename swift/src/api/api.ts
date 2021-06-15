import axios from "axios";
import { RtpCapabilities } from "mediasoup-client/lib/types";

export const getRouterCapabilities = async () => {
  return axios.get<RtpCapabilities>(
    "https://localhost:4000/api/router/capabilities"
  );
};
