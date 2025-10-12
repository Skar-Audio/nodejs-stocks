import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {ExternalLink, TrendingDown, TrendingUp} from 'lucide-react';

export default function NewsLane({symbol}) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!symbol) return;

        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/news/${symbol}?limit=10`);
                const result = await response.json();

                if (result.success) {
                    setNews(result.news);
                } else {
                    setError(result.error || 'Failed to fetch news');
                }
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to load news');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [symbol]);

    const getSentimentColor = (sentiment) => {
        if (!sentiment) return 'bg-gray-100 text-gray-700';
        if (sentiment.score >= 0.3)
            return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
        if (sentiment.score <= -0.3)
            return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    };

    const getSentimentIcon = (sentiment) => {
        if (!sentiment) return null;
        if (sentiment.score >= 0.3) return <TrendingUp className="h-3 w-3"/>;
        if (sentiment.score <= -0.3) return <TrendingDown className="h-3 w-3"/>;
        return null;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>News & Events</CardTitle>
                    <CardDescription>Latest news for {symbol}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-3/4"/>
                            <Skeleton className="h-3 w-full"/>
                            <Skeleton className="h-3 w-5/6"/>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>News & Events</CardTitle>
                    <CardDescription>Latest news for {symbol}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>News & Events</CardTitle>
                <CardDescription>
                    Latest news for {symbol} ({news.length} articles)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {news.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No news available</p>
                ) : (
                    <div className="space-y-4">
                        {news.map((item) => (
                            <div
                                key={item.id}
                                className="border-l-2 border-muted pl-4 pb-4 last:pb-0 hover:border-primary transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium hover:underline flex items-center gap-1"
                                        >
                                            {item.title}
                                            <ExternalLink className="h-3 w-3"/>
                                        </a>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {item.source} • {formatDate(item.publishedAt)}
                                        </p>
                                    </div>
                                    {item.sentiment && (
                                        <Badge
                                            variant="outline"
                                            className={`flex items-center gap-1 ${getSentimentColor(item.sentiment)}`}
                                        >
                                            {getSentimentIcon(item.sentiment)}
                                            {item.sentiment.label}
                                        </Badge>
                                    )}
                                </div>
                                {item.summary && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                                )}
                                {item.relevance && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Relevance:</span>
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{width: `${item.relevance * 100}%`}}
                                                />
                                            </div>
                                            <span className="text-xs font-medium">
												{(item.relevance * 100).toFixed(0)}%
											</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
