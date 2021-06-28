import axios from 'axios';
import moment from 'moment';

import { API_URL } from 'utils/domain';
import { getSignature } from 'utils/provider';

import {
  ICircle,
  ITokenGift,
  IUser,
  IUserPendingGift,
  PostCirclesParam,
  PostTokenGiftsParam,
  PostUsersParam,
  PutCirclesParam,
  PutUsersParam,
} from 'types';
import { IEpoch } from 'types/models/epoch.model';

axios.defaults.baseURL = API_URL;

class APIService {
  constructor() {}

  getCircles = async (): Promise<ICircle[]> => {
    const response = await axios.get('/circles');
    return response.data as ICircle[];
  };

  postCircles = async (
    address: string,
    params: PostCirclesParam,
    provider?: any
  ): Promise<any> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.post('/circles', {
      signature,
      data,
      address,
    });
    return response.data;
  };

  putCircles = async (
    id: number,
    address: string,
    name: string,
    token_name: string,
    team_sel_text?: string,
    alloc_text?: string,
    provider?: any
  ): Promise<ICircle> => {
    const params: any = { name, token_name };
    if (team_sel_text !== undefined) {
      params.team_sel_text = team_sel_text;
    }
    if (alloc_text !== undefined) {
      params.alloc_text = alloc_text;
    }
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.put(`admin/circles/${id}`, {
      signature,
      data,
      address,
    });
    return response.data as ICircle;
  };

  getEpochs = async (current?: number): Promise<IEpoch[]> => {
    const params: any = {};
    if (current !== undefined) {
      params.current = current;
    }
    const response = await axios.get('/epoches', { params });
    return response.data as IEpoch[];
  };

  postEpochs = async (
    address: string,
    startDate: Date,
    endDate: Date,
    provider?: any
  ): Promise<IEpoch> => {
    const start_date = `${moment(startDate).format(
      'YYYY-MM-DD'
    )}T00:00:00.000000Z`;
    const end_date = `${moment(endDate).format('YYYY-MM-DD')}T00:00:00.000000Z`;
    const params: any = { start_date, end_date };
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.post('admin/epoches', {
      signature,
      data,
      address,
    });
    return response.data as IEpoch;
  };

  deleteEpochs = async (
    address: string,
    epoch_id: number,
    provider?: any
  ): Promise<any> => {
    const params: any = { epoch_id };
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.delete(`admin/epoches/${epoch_id}`, {
      data: {
        signature,
        data,
        address,
      },
    });
    return response.data;
  };

  getMe = async (address: string): Promise<IUser> => {
    const response = await axios.get(`/users/${address}`);
    return response.data as IUser;
  };

  getUsers = async (
    address?: string,
    circle_id?: number,
    id?: number,
    deleted_users?: boolean
  ): Promise<IUser[]> => {
    const params: any = {};
    if (circle_id !== undefined) {
      params.circle_id = circle_id;
    }
    if (address !== undefined) {
      params.address = address;
    }
    if (id !== undefined) {
      params.id = id;
    }
    if (deleted_users !== undefined) {
      params.deleted_users = true;
    }
    const response = await axios.get('/users', { params });
    return response.data as IUser[];
  };

  postUsers = async (
    adminAddress: string,
    name: string,
    address: string,
    non_giver?: number,
    fixed_non_receiver?: number,
    role?: number,
    starting_tokens?: number,
    provider?: any
  ): Promise<IUser> => {
    const params: any = { name, address };
    if (non_giver !== undefined) {
      params.non_giver = non_giver;
    }
    if (fixed_non_receiver !== undefined) {
      params.fixed_non_receiver = fixed_non_receiver;
    }
    if (role !== undefined) {
      params.role = role;
    }
    if (starting_tokens !== undefined) {
      params.starting_tokens = starting_tokens;
    }
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.post(`admin/users`, {
      signature,
      data,
      address: adminAddress,
    });
    return response.data;
  };

  putUsers = async (
    address: string,
    params: PutUsersParam,
    provider?: any
  ): Promise<IUser> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.put(`/users/${address}`, {
      signature,
      data,
      address,
    });
    return response.data;
  };

  updateUsers = async (
    adminAddress: string,
    name: string,
    originAddress: string,
    address: string,
    non_giver?: number,
    fixed_non_receiver?: number,
    role?: number,
    starting_tokens?: number,
    provider?: any
  ): Promise<IUser> => {
    const params: any = { name, address };
    if (non_giver !== undefined) {
      params.non_giver = non_giver;
    }
    if (fixed_non_receiver !== undefined) {
      params.fixed_non_receiver = fixed_non_receiver;
    }
    if (role !== undefined) {
      params.role = role;
    }
    if (starting_tokens !== undefined) {
      params.starting_tokens = starting_tokens;
    }
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.put(`admin/users/${originAddress}`, {
      signature,
      data,
      address: adminAddress,
    });
    return response.data;
  };

  deleteUsers = async (
    adminAddress: string,
    address: string,
    provider?: any
  ): Promise<any> => {
    const params: any = { address };
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.delete(`admin/users/${address}`, {
      data: {
        signature,
        data,
        address: adminAddress,
      },
    });
    return response.data;
  };

  postUploadImage = async (
    address: string,
    file: File,
    provider?: any
  ): Promise<any> => {
    const filename = 'avatar.png';
    const data = filename;
    const signature = await getSignature(data, provider);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('address', address);
    formData.append('data', data);
    const response = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  postTeammates = async (
    address: string,
    teammates: number[],
    provider?: any
  ): Promise<IUser> => {
    const data = JSON.stringify({ teammates: teammates });
    const signature = await getSignature(data, provider);
    const response = await axios.post('/teammates', {
      signature,
      data,
      address,
    });
    return response.data;
  };

  getPendingTokenGifts = async (
    sender_address?: string,
    recipient_address?: string,
    circle_id?: number,
    id?: number
  ): Promise<ITokenGift[]> => {
    const params: any = {};
    if (sender_address !== undefined) {
      params.sender_address = sender_address;
    }
    if (recipient_address !== undefined) {
      params.recipient_address = recipient_address;
    }
    if (circle_id !== undefined) {
      params.circle_id = circle_id;
    }
    if (id !== undefined) {
      params.id = id;
    }
    const response = await axios.get('/pending-token-gifts', { params });
    return response.data as ITokenGift[];
  };

  getTokenGifts = async (
    sender_address?: string,
    recipient_address?: string,
    circle_id?: number,
    id?: number
  ): Promise<ITokenGift[]> => {
    const params: any = {};
    if (sender_address !== undefined) {
      params.sender_address = sender_address;
    }
    if (recipient_address !== undefined) {
      params.recipient_address = recipient_address;
    }
    if (circle_id !== undefined) {
      params.circle_id = circle_id;
    }
    if (id !== undefined) {
      params.id = id;
    }
    const response = await axios.get('/token-gifts', { params });
    return response.data as ITokenGift[];
  };

  postTokenGifts = async (
    address: string,
    params: PostTokenGiftsParam[],
    provider?: any
  ): Promise<IUserPendingGift> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.post(`/v2/token-gifts/${address}`, {
      signature,
      data,
      address,
    });
    return response.data;
  };
}

let apiService: APIService;

export const getApiService = (): APIService => {
  if (apiService) return apiService;
  apiService = new APIService();
  return apiService;
};
