import axios from 'axios';
import moment from 'moment';

import { API_URL } from 'utils/domain';
import { getSignature } from 'utils/provider';

import {
  IApiCircle,
  IApiTokenGift,
  IApiFilledProfile,
  IApiUser,
  IApiUserProfile,
  IApiEpoch,
  PostProfileParam,
  PostCirclesParam,
  PostTokenGiftsParam,
  PostUsersParam,
  PutCirclesParam,
  PutUsersParam,
  UpdateUsersParam,
  UpdateCreateEpochParam,
} from 'types';

axios.defaults.baseURL = API_URL;

export class APIService {
  provider = undefined;

  constructor(provider?: any) {
    this.provider = provider;
  }

  setProvider(provider?: any) {
    this.provider = provider;
  }

  getProfile = async (address: string): Promise<IApiFilledProfile> => {
    const response = await axios.get(`/profile/${address}`);
    return (response.data.profile ?? response.data) as IApiFilledProfile;
  };

  updateProfile = async (
    address: string,
    params: PostProfileParam
  ): Promise<IApiFilledProfile> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post(`/profile`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data;
  };

  getCircles = async (): Promise<IApiCircle[]> => {
    const response = await axios.get('/circles');
    return response.data as IApiCircle[];
  };

  // Unused.
  postCircles = async (
    address: string,
    params: PostCirclesParam
  ): Promise<IApiCircle> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post('/circles', {
      signature,
      data,
      address,
      hash,
    });
    return response.data;
  };

  putCircles = async (
    circleId: number,
    address: string,
    params: PutCirclesParam
  ): Promise<IApiCircle> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.put(`${circleId}/admin/circles/${circleId}`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data as IApiCircle;
  };

  uploadCircleLogo = async (
    circleId: number,
    address: string,
    file: File
  ): Promise<IApiCircle> => {
    const { signature, hash } = await getSignature(file.name, this.provider);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('address', address);
    formData.append('data', file.name);
    formData.append('hash', hash);
    const response = await axios.post(
      `${circleId}/admin/upload-logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data as IApiCircle;
  };

  getEpochs = async (
    circleId: number,
    params: { current?: number } = {}
  ): Promise<IApiEpoch[]> => {
    const response = await axios.get(`${circleId}/epoches`, { params });
    const epochs = response.data as IApiEpoch[];
    return epochs as IApiEpoch[];
  };

  getFutureEpochs = async (
    params: {
      circle_id?: number;
    } = {}
  ): Promise<IApiEpoch[]> => {
    const response = await axios.get(`active-epochs`, { params });
    return response.data as IApiEpoch[];
  };

  createEpoch = async (
    address: string,
    circleId: number,
    params: UpdateCreateEpochParam
  ): Promise<IApiEpoch> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/admin/v2/epoches`, {
      signature,
      data,
      address,
    });
    return response.data as IApiEpoch;
  };

  createEpochDeprecated = async (
    address: string,
    circleId: number,
    startDate: Date,
    endDate: Date
  ): Promise<IApiEpoch> => {
    const start_date = `${moment(startDate).format(
      'YYYY-MM-DD'
    )}T00:00:00.000000Z`;
    const end_date = `${moment(endDate).format('YYYY-MM-DD')}T00:00:00.000000Z`;
    const params: any = { start_date, end_date };
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/admin/epoches`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data as IApiEpoch;
  };

  updateEpoch = async (
    address: string,
    circleId: number,
    params: UpdateCreateEpochParam
  ): Promise<IApiEpoch> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.put(`${circleId}/admin/epoches`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data as IApiEpoch;
  };

  deleteEpoch = async (
    address: string,
    circleId: number,
    epochId: number
  ): Promise<any> => {
    const data = JSON.stringify({ epoch_id: epochId });
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.delete(
      `${circleId}/admin/epoches/${epochId}`,
      {
        data: {
          signature,
          data,
          address,
          hash,
        },
      }
    );
    return response.data;
  };

  getUsers = async (
    params: {
      address?: string;
      circle_id?: number;
      id?: number;
      deleted_users?: boolean;
    } = {}
  ): Promise<IApiUserProfile[]> => {
    const response = await axios.get('/users', { params });
    return response.data as IApiUserProfile[];
  };

  createUser = async (
    circleId: number,
    adminAddress: string,
    params: PostUsersParam
  ): Promise<IApiUser> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/admin/users`, {
      signature,
      data,
      address: adminAddress,
      hash,
    });
    return response.data;
  };

  updateUsers = async (
    circleId: number,
    adminAddress: string,
    originalAddress: string,
    params: UpdateUsersParam
  ): Promise<IApiUser> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.put(
      `${circleId}/admin/users/${originalAddress}`,
      {
        signature,
        data,
        address: adminAddress,
        hash,
      }
    );
    return response.data;
  };

  updateMyUser = async (
    circleId: number,
    address: string,
    params: PutUsersParam
  ): Promise<IApiUser> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.put(`${circleId}/users`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data;
  };

  deleteUsers = async (
    circleId: number,
    adminAddress: string,
    address: string
  ): Promise<IApiUser> => {
    const params: any = { address };
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.delete(`${circleId}/admin/users/${address}`, {
      data: {
        signature,
        data,
        address: adminAddress,
        hash,
      },
    });
    return response.data;
  };

  postProfileUpload = async (address: string, file: File, endpoint: string) => {
    const { signature, hash } = await getSignature(file.name, this.provider);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('address', address);
    formData.append('data', file.name);
    formData.append('hash', hash);
    const response = await axios.post(`/${endpoint}/${address}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  uploadAvatar = async (address: string, file: File): Promise<any> =>
    this.postProfileUpload(address, file, 'upload-avatar');

  uploadBackground = async (address: string, file: File): Promise<any> =>
    this.postProfileUpload(address, file, 'upload-background');

  postTeammates = async (
    circleId: number,
    address: string,
    teammates: number[]
  ): Promise<IApiUser> => {
    const data = JSON.stringify({ teammates: teammates });
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/teammates`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data;
  };

  getPendingTokenGifts = async (params: {
    sender_address?: string;
    recipient_address?: string;
    circle_id?: number;
    id?: number;
  }): Promise<IApiTokenGift[]> => {
    const response = await axios.get('/pending-token-gifts', { params });
    return response.data as IApiTokenGift[];
  };

  getTokenGifts = async (params: {
    sender_address?: string;
    recipient_address?: string;
    circle_id?: number;
    id?: number;
  }): Promise<IApiTokenGift[]> => {
    const response = await axios.get('/token-gifts', { params });
    return response.data as IApiTokenGift[];
  };

  postTokenGifts = async (
    circleId: number,
    address: string,
    params: PostTokenGiftsParam[]
  ): Promise<any> => {
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/v2/token-gifts/${address}`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data;
  };
  getDiscordWebhook = async (
    address: string,
    circleId: number
  ): Promise<any> => {
    const params: any = { address };
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/admin/webhook`, {
      signature,
      data,
      address,
      hash,
    });
    return response.data;
  };

  setDiscordWebhook = async (
    address: string,
    circleId: number,
    discord_webhook: string
  ): Promise<any> => {
    const params: any = { address, discord_webhook };
    const data = JSON.stringify(params);
    const { signature, hash } = await getSignature(data, this.provider);
    const response = await axios.put(`${circleId}/admin/update-webhook`, {
      signature,
      data,
      address,
      hash,
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
