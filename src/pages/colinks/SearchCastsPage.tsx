import { useState, useEffect } from 'react';

import { formatDistance, subDays, subMonths, subWeeks } from 'date-fns';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { fetchSimilarCasts } from '../../features/SearchBox/fetchSimilarCasts';
import { Search } from '../../icons/__generated';
import {
  Button,
  ContentHeader,
  Flex,
  Panel,
  Text,
  TextField,
  Link,
} from '../../ui';
import { TwoColumnSmallRightLayout } from '../../ui/layouts';

// Define an interface for the enriched cast data
interface EnrichedCast {
  id: number;
  text: string;
  timestamp: string;
  hash?: string;
  profile_public?: {
    id?: any;
    name?: any;
    address?: string;
    avatar?: string;
  };
}

interface SearchResult {
  cast_id: number;
  similarity: number;
  enriched_cast?: EnrichedCast;
}

// Define time range options
type TimeRange = 'all' | '1day' | '1week' | '1month';

export const SearchCastsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('q') || ''
  );
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  // Initial search if URL has a query
  useEffect(() => {
    if (searchParams.get('q')) {
      handleSearch();
    }
  }, []); // Run once on mount

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Update URL with search term
    setSearchParams({ q: searchTerm });

    try {
      const results = await fetchSimilarCasts({ search: searchTerm });
      setSearchResults(results);
      // eslint-disable-next-line no-console
      console.log('Search results with enriched data:', results);
    } catch (error) {
      console.error('Error searching casts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    if (!value) {
      // Clear URL params when search is cleared
      setSearchParams({});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter results based on selected time range
  const getFilteredResults = () => {
    if (timeRange === 'all') return searchResults;

    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case '1day':
        cutoffDate = subDays(now, 1);
        break;
      case '1week':
        cutoffDate = subWeeks(now, 1);
        break;
      case '1month':
        cutoffDate = subMonths(now, 1);
        break;
      default:
        return searchResults;
    }

    return searchResults.filter(result => {
      if (!result.enriched_cast?.timestamp) return false;
      const castDate = new Date(result.enriched_cast.timestamp);
      return castDate >= cutoffDate;
    });
  };

  const filteredResults = getFilteredResults();

  return (
    <TwoColumnSmallRightLayout>
      <Helmet>
        <title>Search Casts / Coordinape</title>
      </Helmet>
      <Flex column css={{ gap: '$xl' }}>
        <ContentHeader
          css={{
            background:
              'linear-gradient(to bottom, $surface_bright, transparent)',
            borderBottom: '1px solid $neutral100',
          }}
        >
          <Flex
            column
            css={{
              flexGrow: 1,
              alignItems: 'center',
              width: '100%',
              gap: '$sm',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <Text
              h1
              css={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, $primary, $secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                mb: '$sm',
              }}
            >
              Search Casts
            </Text>
            <Flex
              css={{
                width: '100%',
                gap: '$sm',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <TextField
                placeholder="Search for casts..."
                value={searchTerm}
                onChange={e => handleSearchTermChange(e.target.value)}
                onKeyDown={handleKeyDown}
                css={{
                  flexGrow: 1,
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '24px',
                  px: '$xl',
                  '&:focus': {
                    boxShadow: '0 0 0 2px $colors$primary',
                    border: 'none',
                  },
                }}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                css={{
                  height: '48px',
                  px: '$xl',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: '$primary',
                  transition: 'all 0.2s ease',
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Search css={{ mr: '$sm' }} /> Search
              </Button>
            </Flex>

            {/* Time range selector */}
            <Flex
              css={{
                gap: '$md',
                mt: '$sm',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                size="small"
                css={{
                  color: '$text_muted',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Time range:
              </Text>
              <Flex css={{ gap: '$sm' }}>
                {(['all', '1day', '1week', '1month'] as const).map(range => (
                  <Button
                    key={range}
                    size="small"
                    css={{
                      backgroundColor:
                        timeRange === range ? '$primary' : '$surface_verylow',
                      color: timeRange === range ? 'white' : '$text',
                      borderRadius: '16px',
                      px: '$lg',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor:
                          timeRange === range ? '$primary' : '$neutral200',
                      },
                    }}
                    onClick={() => setTimeRange(range)}
                  >
                    {range === 'all' ? 'All time' : range.replace('1', '1 ')}
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </ContentHeader>

        {isSearching ? (
          <LoadingIndicator />
        ) : hasSearched ? (
          filteredResults.length > 0 ? (
            <>
              <Flex
                css={{
                  alignItems: 'center',
                  gap: '$sm',
                  background: '$surface_bright',
                  borderRadius: '$md',
                  border: '1px solid $neutral100',
                }}
              >
                <Text
                  size="large"
                  semibold
                  css={{
                    color: '$text',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$sm',
                  }}
                >
                  <Text css={{ color: '$primary' }}>
                    {filteredResults.length}
                  </Text>
                  results for
                  <Text
                    css={{
                      color: '$primary',
                      fontStyle: 'italic',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    &ldquo;{searchTerm}&rdquo;
                  </Text>
                  {timeRange !== 'all' && (
                    <Text css={{ color: '$text_muted', fontWeight: 'normal' }}>
                      in the last {timeRange.replace('1', '1 ')}
                    </Text>
                  )}
                </Text>
              </Flex>
              <SearchResultsList results={filteredResults} />
            </>
          ) : (
            <NoResultsMessage searchTerm={searchTerm} timeRange={timeRange} />
          )
        ) : (
          <SearchPrompt />
        )}
      </Flex>
    </TwoColumnSmallRightLayout>
  );
};

interface SearchResultsListProps {
  results: SearchResult[];
}

const SearchResultsList = ({ results }: SearchResultsListProps) => {
  // Sort results by similarity (highest first)
  const sortedResults = [...results].sort((a, b) => {
    // Primary sort by similarity
    const similarityDiff = b.similarity - a.similarity;

    // If similarity is equal (unlikely but possible), use timestamp as secondary sort
    if (similarityDiff === 0) {
      const timeA = a.enriched_cast?.timestamp
        ? new Date(a.enriched_cast.timestamp).getTime()
        : 0;
      const timeB = b.enriched_cast?.timestamp
        ? new Date(b.enriched_cast.timestamp).getTime()
        : 0;
      return timeB - timeA;
    }

    return similarityDiff;
  });

  return (
    <Flex column css={{ gap: '$md' }}>
      {sortedResults.map(result => (
        <SearchResultItem key={result.cast_id} result={result} />
      ))}
    </Flex>
  );
};

interface SearchResultItemProps {
  result: SearchResult;
}

const SearchResultItem = ({ result }: SearchResultItemProps) => {
  const { similarity, enriched_cast } = result;

  if (!enriched_cast) {
    return null;
  }

  const { text, timestamp, profile_public, hash } = enriched_cast;
  const formattedHash = hash ? new String(hash).replaceAll('\\', '0') : null;
  const formattedDate = timestamp
    ? formatDistance(new Date(timestamp), new Date(), { addSuffix: true })
    : 'Unknown date';
  const fullDate = timestamp
    ? new Date(timestamp).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
      })
    : null;

  // Create Warpcast URL using conversations endpoint with the formatted hash
  const warpcastUrl = formattedHash
    ? `https://warpcast.com/~/conversations/${formattedHash}`
    : null;

  return (
    <Panel
      css={{ p: '$md', borderRadius: '$md', border: '1px solid $neutral100' }}
    >
      <Flex column css={{ gap: '$sm' }}>
        {/* Header with profile info */}
        <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Flex css={{ gap: '$sm', alignItems: 'center' }}>
            {profile_public?.avatar ? (
              <img
                src={profile_public.avatar}
                alt={profile_public.name || 'User'}
                style={{ width: 36, height: 36, borderRadius: '50%' }}
              />
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                {(profile_public?.name || 'A')[0].toUpperCase()}
              </div>
            )}
            <Flex column css={{ gap: '$xs' }}>
              <Text semibold css={{ fontSize: '$md' }}>
                {profile_public?.name || 'Anonymous User'}
              </Text>
              <Text
                size="small"
                css={{
                  color: '$text_muted',
                  fontSize: '12px',
                  cursor: 'help',
                }}
                title={fullDate || undefined}
              >
                {formattedDate}
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ gap: '$xs', alignItems: 'center' }}>
            <Text
              size="small"
              css={{ color: '$primary', fontWeight: 'bold', fontSize: '12px' }}
            >
              Similarity:
            </Text>
            <Text size="small" css={{ color: '$text_muted', fontSize: '12px' }}>
              {similarity.toFixed(4)}
            </Text>
          </Flex>
        </Flex>

        {/* Cast content */}
        {warpcastUrl ? (
          <Link
            href={warpcastUrl}
            target="_blank"
            css={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                textDecoration: 'none',
                '& > p': {
                  color: '$text_link',
                },
              },
            }}
          >
            <Text
              css={{
                lineHeight: 1.5,
                fontSize: '14px',
                margin: '$xs 0',
                transition: 'color 0.2s ease',
              }}
            >
              {text}
            </Text>
          </Link>
        ) : (
          <Text
            css={{
              lineHeight: 1.5,
              fontSize: '14px',
              margin: '$xs 0',
            }}
          >
            {text}
          </Text>
        )}

        {/* Footer with metadata and actions */}
        <Flex
          css={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            mt: '$xs',
            pt: '$sm',
            borderTop: '1px solid $neutral50',
          }}
        >
          {warpcastUrl && (
            <Link
              href={warpcastUrl}
              target="_blank"
              css={{
                color: '$text_link',
                textDecoration: 'none',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '$xs',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              View on Warpcast
            </Link>
          )}
        </Flex>
      </Flex>
    </Panel>
  );
};

const NoResultsMessage = ({
  searchTerm,
  timeRange,
}: {
  searchTerm: string;
  timeRange: TimeRange;
}) => {
  const timeRangeText =
    timeRange !== 'all' ? ` in the last ${timeRange.replace('1', '1 ')}` : '';

  return (
    <Panel css={{ textAlign: 'center' }}>
      <Flex column css={{ gap: '$md', alignItems: 'center' }}>
        <Text h2>No results found</Text>
        <Text>
          We couldn&apos;t find any casts matching &quot;{searchTerm}&quot;
          {timeRangeText}. Try different keywords, phrases, or adjust the time
          range.
        </Text>
      </Flex>
    </Panel>
  );
};

const SearchPrompt = () => {
  return (
    <Panel css={{ p: '$lg', textAlign: 'center' }}>
      <Flex column css={{ gap: '$md', alignItems: 'center' }}>
        <Text h2>Search for casts</Text>
        <Text>
          Enter a search term above to find casts related to your query.
        </Text>
      </Flex>
    </Panel>
  );
};
