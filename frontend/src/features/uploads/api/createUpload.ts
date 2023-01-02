import axios from 'axios';

const createUpload = async (payload: FormData): Promise<number> => {
	return await axios.post('/api/uploads', payload);
};
