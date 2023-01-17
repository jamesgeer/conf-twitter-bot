import axios from 'axios';
import { Upload } from '../types';

export const deleteUpload = async (uploadId: number): Promise<Upload> => {
	const response = await axios.delete(`/api/uploads/${uploadId}`);
	return response.data;
};
