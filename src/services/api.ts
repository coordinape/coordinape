import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios';

import { API_URL } from 'config/env';
import { getSignature } from 'utils/provider';

import {
  IApiCircle,
  IApiTokenGift,
  IApiProfile,
  IApiUser,
  IApiEpoch,
  IApiLogin,
  IApiManifest,
  PostProfileParam,
  PostTokenGiftsParam,
  PutCirclesParam,
  PutUsersParam,
  UpdateCreateEpochParam,
  IApiFullCircle,
} from 'types';

axios.defaults.baseURL = API_URL;

export class APIService {
  provider = undefined as Web3Provider | undefined;
  token = undefined as string | undefined;
  axios = axios.create({ baseURL: API_URL });

  constructor(provider?: Web3Provider, token?: string) {
    this.provider = provider;
    token && this.setAuth(token);
  }

  setProvider(provider?: Web3Provider) {
    this.provider = provider;
  }

  setAuth(token?: string) {
    this.token = token;

    const auth: Record<string, unknown> = {};
    if (token) {
      const authHeader = 'Bearer ' + token;
      auth.headers = { Authorization: authHeader };
    }

    this.axios = axios.create({ baseURL: API_URL, ...auth });
  }

  login = async (address: string): Promise<IApiLogin> => {
    let now;
    try {
      const nowReq = await fetch('/api/time');
      now = parseInt(await nowReq.text());
      if (isNaN(now)) now = Date.now();
    } catch (e) {
      now = Date.now();
    }

    const data = `Login to Coordinape ${Math.floor(now / 1000)}`;
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await this.axios.post('/v2/login', {
      signature,
      hash,
      address,
      data,
    });
    return response.data;
  };

  getManifest = async (circleId?: number): Promise<IApiManifest> => {
    const response = await this.axios.get('/v2/manifest', {
      params: {
        circle_id: circleId,
      },
    });
    return response.data;
  };

  getFullCircle = async (circleId: number): Promise<IApiFullCircle> => {
    const response = await this.axios.get(`/v2/full-circle`, {
      params: {
        circle_id: circleId,
      },
    });
    return response.data;
  };

  getProfile = async (address: string): Promise<IApiProfile> => {
    return (await this.axios.get(`/v2/profile/${address}`)).data;
  };

  updateProfile = async (params: PostProfileParam): Promise<IApiProfile> => {
    const data = JSON.stringify(params);
    const response = await this.axios.post(`/v2/profile`, {
      data,
    });
    return response.data;
  };

  putCircles = async (
    circleId: number,
    params: PutCirclesParam
  ): Promise<IApiCircle> => {
    const data = JSON.stringify(params);
    const response = await this.axios.put(
      `/v2/${circleId}/admin/circles/${circleId}`,
      {
        data,
      }
    );
    return response.data as IApiCircle;
  };

  createEpoch = async (
    circleId: number,
    params: UpdateCreateEpochParam
  ): Promise<IApiEpoch> => {
    const data = JSON.stringify(params);
    const response = await this.axios.post(`/v2/${circleId}/admin/epoches`, {
      data,
    });
    return response.data as IApiEpoch;
  };

  updateEpoch = async (
    circleId: number,
    epochId: number,
    params: UpdateCreateEpochParam
  ): Promise<IApiEpoch> => {
    const response = await this.axios.put(
      `/v2/${circleId}/admin/epoches/${epochId}`,
      {
        data: JSON.stringify(params),
      }
    );
    return response.data as IApiEpoch;
  };

  deleteEpoch = async (circleId: number, epochId: number): Promise<any> => {
    const response = await this.axios.delete(
      `/v2/${circleId}/admin/epoches/${epochId}`
    );
    return response.data;
  };

  updateMyUser = async (
    circleId: number,
    params: PutUsersParam
  ): Promise<IApiUser> => {
    const response = await this.axios.put(`/v2/${circleId}/users`, {
      data: JSON.stringify(params),
    });
    return response.data;
  };

  deleteUser = async (circleId: number, address: string): Promise<IApiUser> => {
    const response = await this.axios.delete(
      `/v2/${circleId}/admin/users/${address}`
    );
    return response.data;
  };

  postTeammates = async (
    circleId: number,
    teammates: number[]
  ): Promise<IApiUser & { pending_sent_gifts: IApiTokenGift[] }> => {
    const response = await this.axios.post(`/v2/${circleId}/teammates`, {
      data: JSON.stringify({ teammates: teammates }),
    });
    return response.data;
  };

  postTokenGifts = async (
    circleId: number,
    params: PostTokenGiftsParam[]
  ): Promise<IApiUser & { pending_sent_gifts: IApiTokenGift[] }> => {
    const response = await this.axios.post(`/v2/${circleId}/token-gifts`, {
      data: JSON.stringify(params),
    });
    return response.data;
  };

  getDiscordWebhook = async (circleId: number): Promise<any> => {
    const response = await this.axios.get(`/v2/${circleId}/admin/webhook`);
    return response.data;
  };

  downloadCSV = async (circleId: number, epoch: number): Promise<any> => {
    return this.axios.get(`/v2/${circleId}/csv?epoch=${epoch}`);
  };
}

let apiService: APIService;

export const getApiService = (): APIService => {
  if (apiService) {
    return apiService;
  }
  apiService = new APIService();
  return apiService;
};

export const getAuthToken = () => getApiService().token;
