export const fetchFarcasterUserResults = async ({
  search,
}: {
  search: string;
}) => {
  if (search === '') {
    return [];
  }
  const resp = await fetch(
    `/api/farcaster/users/${encodeURIComponent(search)}`
  );
  return resp.json() as Promise<
    {
      fname: string;
      address: string;
      avatar_url?: string;
      display_name?: string;
    }[]
  >;
};
