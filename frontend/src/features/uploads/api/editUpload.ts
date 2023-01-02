import axios from 'axios';

const editUpload = async (payload: FormData): Promise<unknown> => {
	return await axios.patch('/api/uploads/' + payload.get('uploadId'), payload);
};
