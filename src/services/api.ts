import axios from 'axios';
import moment from 'moment';

import { API_URL } from 'utils/domain';
import { getSignature } from 'utils/provider';

import {
  ICircle,
  ITokenGift,
  IUser,
  IProfile,
  IEpoch,
  IUserPendingGift,
  PostProfileParam,
  PostCirclesParam,
  PostTokenGiftsParam,
  PostUsersParam,
  PutCirclesParam,
  PutUsersParam,
  UpdateUsersParam,
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

  getProfile = async (address: string): Promise<IProfile> => {
    const response = await axios.get(`/profile/${address}`);
    return (response.data.profile ?? response.data) as IProfile;
  };

  postProfile = async (
    address: string,
    params: PostProfileParam
  ): Promise<any> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.post(`/profile/${address}`, {
      signature,
      data,
      address,
    });
    return response.data;
  };

  getCircles = async (): Promise<ICircle[]> => {
    const response = await axios.get('/circles');
    return response.data as ICircle[];
  };

  // Unused.
  postCircles = async (
    address: string,
    params: PostCirclesParam
  ): Promise<any> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.post('/circles', {
      signature,
      data,
      address,
    });
    return response.data;
  };

  putCircles = async (
    circleId: number,
    address: string,
    params: PutCirclesParam
  ): Promise<ICircle> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.put(`${circleId}/admin/circles/${circleId}`, {
      signature,
      data,
      address,
    });
    return response.data as ICircle;
  };

  getEpochs = async (
    circleId: number,
    params: { current?: number } = {}
  ): Promise<IEpoch[]> => {
    const response = await axios.get(`${circleId}/epoches`, { params });
    return response.data as IEpoch[];
  };

  getFutureEpochs = async (
    params: {
      circle_id?: number;
    } = {}
  ): Promise<IEpoch[]> => {
    const response = await axios.get(`active-epochs`, { params });
    return response.data as IEpoch[];
  };

  postEpochs = async (
    address: string,
    circleId: number,
    startDate: Date,
    endDate: Date
  ): Promise<IEpoch> => {
    const start_date = `${moment(startDate).format(
      'YYYY-MM-DD'
    )}T00:00:00.000000Z`;
    const end_date = `${moment(endDate).format('YYYY-MM-DD')}T00:00:00.000000Z`;
    const params: any = { start_date, end_date };
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/admin/epoches`, {
      signature,
      data,
      address,
    });
    return response.data as IEpoch;
  };

  deleteEpochs = async (
    address: string,
    circleId: number,
    epochId: number
  ): Promise<any> => {
    const data = JSON.stringify({ epoch_id: epochId });
    const signature = await getSignature(data, this.provider);
    const response = await axios.delete(
      `${circleId}/admin/epoches/${epochId}`,
      {
        data: {
          signature,
          data,
          address,
        },
      }
    );
    return response.data;
  };

  getUserWithTeammates = async (
    circleId: number,
    address: string
  ): Promise<IUser> => {
    const response = await axios.get(`${circleId}/users/${address}`);
    return response.data as IUser;
  };

  getUsers = async (
    params: {
      address?: string;
      circle_id?: number;
      id?: number;
      deleted_users?: boolean;
    } = {}
  ): Promise<IUser[]> => {
    const response = await axios.get('/users', { params });
    return response.data as IUser[];
  };

  postUsers = async (
    circleId: number,
    adminAddress: string,
    params: PostUsersParam
  ): Promise<IUser> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/admin/users`, {
      signature,
      data,
      address: adminAddress,
    });
    return response.data;
  };

  updateUsers = async (
    circleId: number,
    adminAddress: string,
    originalAddress: string,
    params: UpdateUsersParam
  ): Promise<IUser> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.put(
      `${circleId}/admin/users/${originalAddress}`,
      {
        signature,
        data,
        address: adminAddress,
      }
    );
    return response.data;
  };

  putUsers = async (
    circleId: number,
    address: string,
    params: PutUsersParam
  ): Promise<IUser> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.put(`${circleId}/users/${address}`, {
      signature,
      data,
      address,
    });
    return response.data;
  };

  deleteUsers = async (
    circleId: number,
    adminAddress: string,
    address: string
  ): Promise<IUser> => {
    const params: any = { address };
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.delete(`${circleId}/admin/users/${address}`, {
      data: {
        signature,
        data,
        address: adminAddress,
      },
    });
    return response.data;
  };

  // TODO: remove?
  postUploadImage = async (
    circleId: number,
    address: string,
    file: File
  ): Promise<any> => {
    const filename = 'avatar.png';
    const data = filename;
    const signature = await getSignature(data, this.provider);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('address', address);
    formData.append('data', data);
    const response = await axios.post(`/${circleId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  // TODO: Hook this up
  uploadAvatar = async (
    circleId: number,
    address: string,
    file: File
  ): Promise<any> => {
    const filename = 'avatar.png';
    const data = filename;
    const signature = await getSignature(data, this.provider);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('address', address);
    formData.append('data', data);
    const response = await axios.post(`/${circleId}/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  // TODO: Hook this up & combine with uploadAvatar?
  uploadBackground = async (
    circleId: number,
    address: string,
    file: File
  ): Promise<any> => {
    const filename = 'background.png';
    const data = filename;
    const signature = await getSignature(data, this.provider);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('address', address);
    formData.append('data', data);
    const response = await axios.post(
      `/${circleId}/upload-background`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  };

  postTeammates = async (
    circleId: number,
    address: string,
    teammates: number[]
  ): Promise<IUser> => {
    const data = JSON.stringify({ teammates: teammates });
    const signature = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/teammates`, {
      signature,
      data,
      address,
    });
    return response.data;
  };

  getPendingTokenGifts = async (params: {
    sender_address?: string;
    recipient_address?: string;
    circle_id?: number;
    id?: number;
  }): Promise<ITokenGift[]> => {
    const response = await axios.get('/pending-token-gifts', { params });
    return response.data as ITokenGift[];
  };

  getTokenGifts = async (params: {
    sender_address?: string;
    recipient_address?: string;
    circle_id?: number;
    id?: number;
  }): Promise<ITokenGift[]> => {
    const response = await axios.get('/token-gifts', { params });
    return response.data as ITokenGift[];
  };

  postTokenGifts = async (
    circleId: number,
    address: string,
    params: PostTokenGiftsParam[]
  ): Promise<IUserPendingGift> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, this.provider);
    const response = await axios.post(`${circleId}/v2/token-gifts/${address}`, {
      signature,
      data,
      address,
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
