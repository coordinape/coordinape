import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios';

import { API_URL } from 'utils/domain';
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
  PostUsersParam,
  PutCirclesParam,
  PutUsersParam,
  UpdateUsersParam,
  UpdateCreateEpochParam,
  NominateUserParam,
  IApiNominee,
  CreateCircleParam,
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
    const auth = token
      ? {
          headers: { Authorization: 'Bearer ' + token },
        }
      : {};
    this.axios = axios.create({ baseURL: API_URL, ...auth });
  }

  login = async (address: string): Promise<IApiLogin> => {
    const { signature, hash } = await getSignature(
      'Login to Coordinape',
      this.provider
    );
    const response = await this.axios.post('/v2/login', {
      signature,
      hash,
      address,
    });
    return response.data;
  };

  logout = async (): Promise<boolean> => {
    return (await this.axios.post('/v2/logout')).data;
  };

  getManifest = async (circleId?: number): Promise<IApiManifest> => {
    const response = await this.axios.post('/v2/manifest', {
      circle_id: circleId,
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

  createCircle = async (
    address: string,
    params: CreateCircleParam,
    captcha_token: string,
    uxresearch_json: string
  ): Promise<IApiCircle> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await this.axios.post('/circles', {
      signature,
      data,
      address,
      hash,
      captcha_token,
      uxresearch_json,
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

  uploadCircleLogo = async (
    circleId: number,
    file: File
  ): Promise<IApiCircle> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', file.name);
    const response = await this.axios.post(
      `/v2/${circleId}/admin/upload-logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  createUser = async (
    circleId: number,
    params: PostUsersParam
  ): Promise<IApiUser> => {
    const response = await this.axios.post(`/v2/${circleId}/admin/users`, {
      data: JSON.stringify(params),
    });
    return response.data;
  };

  updateUser = async (
    circleId: number,
    originalAddress: string,
    params: UpdateUsersParam
  ): Promise<IApiUser> => {
    const response = await this.axios.put(
      `/v2/${circleId}/admin/users/${originalAddress}`,
      {
        data: JSON.stringify(params),
      }
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

  postProfileUpload = async (file: File, endpoint: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.axios.post(`/v2/${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  uploadAvatar = async (file: File): Promise<any> =>
    this.postProfileUpload(file, 'upload-avatar');

  uploadBackground = async (file: File): Promise<any> =>
    this.postProfileUpload(file, 'upload-background');

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

  nominateUser = async (
    circleId: number,
    params: NominateUserParam
  ): Promise<IApiNominee> => {
    const response = await this.axios.post(`/v2/${circleId}/nominees`, {
      data: JSON.stringify(params),
    });
    return response.data;
  };

  vouchUser = async (
    circleId: number,
    nominee_id: number
  ): Promise<IApiNominee> => {
    const response = await this.axios.post(`/v2/${circleId}/vouch`, {
      data: JSON.stringify({ nominee_id }),
    });
    return response.data;
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
