/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	OG_TAG_API_URL: string;
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const replaceThis = `<meta property="og:description" content="Coordinape | Decentralizing Compensation">`;

export default {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async fetch(originalRequest: Request, env: Env): Promise<Response> {
		// For testing purposes, let us fake the original url
		const originalUrl = originalRequest.headers.get('X-Original-Url') || new URL(originalRequest.url).searchParams.get('originalUrl');

		const apiURL = env.OG_TAG_API_URL;
		let request = originalRequest;
		if (originalUrl) {
			// if we have a fake original URL, shove it in here
			// @ts-ignore
			request = new Request(originalUrl, request);
		}

		const fetchTheTags = async () => {
			console.log('rewriting the og tags');
			const controller = new AbortController();

			// 5 second timeout:

			console.log('URLLLY', apiURL);
			const timeoutId = setTimeout(() => controller.abort(), 5000);
			const tagResponse = await fetch(apiURL, {
				headers: {
					'X-Original-Path': url.pathname,
					...originalRequest.headers,
				},
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			console.log('got the resp');
			if (tagResponse.status !== 200) {
				console.log('error fetching og tags', tagResponse.status, tagResponse.statusText);
				// just return the original
				return undefined;
			}
			console.log('gonna wait for it');
			// ok we got some tags
			const tags = await tagResponse.text();
			console.log('got it');
			return tags;
		};

		const url = new URL(request.url);

		// if (!url.pathname.startsWith('/0x')) {
		// 	// doesn't match our pattern, bail out
		// 	return fetch(url);
		// }

		const tags = await fetchTheTags();
		if (!tags) {
			// unable to fetch tags, return the original
			return fetch(url);
		}

		// Fetch the original response to post-process
		const originalResponse = await fetch(request);
		const originalHeaders = new Headers(originalResponse.headers);

		// Read and modify the response body if needed
		const originalHtml = await originalResponse.text();

		const modifiedHtml = '<!-- SUP -->\n' + originalHtml.replace(replaceThis, tags); // Modify HTML as needed

		// Return the modified response with the original/modified headers
		return new Response(modifiedHtml, {
			status: originalResponse.status,
			statusText: originalResponse.statusText,
			headers: originalHeaders,
		});
	},
};
