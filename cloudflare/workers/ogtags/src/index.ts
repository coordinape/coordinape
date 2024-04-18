export interface Env {
	OG_TAG_API_URL: string;
}

const replaceThis = `<meta name="placeholder" content="replace_this"/>`;

const deleteThese = [
	`<meta name="description" content="Coordinape | Decentralizing Compensation"/>`,
	`<meta property="og:description" content="Coordinape | Decentralizing Compensation">`,
	`<meta name="twitter:description" content="Coordinape | Decentralizing Compensation">`,
];

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
			const controller = new AbortController();

			const originalPath = url.pathname + url.search;

			const timeoutId = setTimeout(() => controller.abort(), 15000);
			const tagResponse = await fetch(apiURL, {
				headers: {
					'X-Original-Path': originalPath,
					'X-Original-Host': url.hostname,
					...originalRequest.headers,
				},
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			if (tagResponse.status !== 200) {
				console.log('error fetching og tags', tagResponse.status, tagResponse.statusText);
				// just return the original
				return undefined;
			}
			// ok we got some tags
			const tags = await tagResponse.text();
			return tags;
		};

		const url = new URL(request.url);

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

		let modifiedHtml = originalHtml.replace(replaceThis, tags); // Modify HTML as needed

		for (const deleteThis of deleteThese) {
			modifiedHtml = modifiedHtml.replace(deleteThis, '');
		}
		// Return the modified response with the original/modified headers
		return new Response(modifiedHtml, {
			status: originalResponse.status,
			statusText: originalResponse.statusText,
			headers: originalHeaders,
		});
	},
};
