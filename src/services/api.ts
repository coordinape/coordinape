import axios from 'axios';
import { ethers } from 'ethers';
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
import { getSignature } from 'utils/provider';
axios.defaults.baseURL = 'https://coordinape.me/api';

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
    address: string,
    id: number,
    params: PutCirclesParam,
    provider?: any
  ): Promise<any> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.post(`/circles/${id}`, {
      signature,
      data,
      address,
    });
    return response.data;
  };

  getUsers = async (
    address?: string,
    circle_id?: number,
    id?: number
  ): Promise<IUser[]> => {
    const params: any = {};
    if (circle_id) {
      params.circle_id = circle_id;
    }
    if (address) {
      params.address = address;
    }
    if (id) {
      params.id = id;
    }
    const response = await axios.get('/users', { params });
    return response.data as IUser[];
  };

  postUsers = async (
    address: string,
    params: PostUsersParam,
    provider?: any
  ): Promise<IUser> => {
    const data = JSON.stringify(params);
    const signature = await getSignature(data, provider);
    const response = await axios.post('/users', {
      signature,
      data,
      address,
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

  getPendingTokenGifts = async (
    sender_address?: string,
    recipient_address?: string,
    circle_id?: number,
    id?: number
  ): Promise<ITokenGift[]> => {
    const params: any = {};
    if (sender_address) {
      params.sender_address = sender_address;
    }
    if (recipient_address) {
      params.recipient_address = recipient_address;
    }
    if (circle_id) {
      params.circle_id = circle_id;
    }
    if (id) {
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
    if (sender_address) {
      params.sender_address = sender_address;
    }
    if (recipient_address) {
      params.recipient_address = recipient_address;
    }
    if (circle_id) {
      params.circle_id = circle_id;
    }
    if (id) {
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

    // const msgHash = ethers.utils.hashMessage(data);
    // const msgHashBytes = ethers.utils.arrayify(msgHash);
    // const recoveredAddress = ethers.utils.recoverAddress(
    //   msgHashBytes,
    //   signature
    // );
    // console.log(recoveredAddress);

    const response = await axios.post(`/token-gifts/${address}`, {
      signature,
      data,
      address,
      // msgHash,
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
