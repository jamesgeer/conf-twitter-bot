import { cleanUp } from '../cleanup';

it('cleanup test', async () => {
	await cleanUp();
	expect(1 + 1).toEqual(3);
});
