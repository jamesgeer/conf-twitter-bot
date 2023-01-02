import axios from 'axios';

const deleteUpload = async (uploadId: number): Promise<any> => {
	return await axios.delete('/api/uploads/' + uploadId);
};
