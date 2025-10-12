import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Activity, Home, Search, TrendingUp, X} from 'lucide-react';

export default function CommandPalette() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Open with Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            // Close with Escape
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle navigation within results
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    // Search for stocks and commands
    useEffect(() => {
        if (!query.trim()) {
            setResults(getDefaultCommands());
            setSelectedIndex(0);
            return;
        }

        const searchResults = [];

        // Search commands
        const commands = getDefaultCommands();
        const matchingCommands = commands.filter(
            (cmd) =>
                cmd.title.toLowerCase().includes(query.toLowerCase()) ||
                cmd.subtitle?.toLowerCase().includes(query.toLowerCase())
        );
        searchResults.push(...matchingCommands);

        // Search stocks (if query looks like a symbol)
        if (query.length >= 1) {
            searchResults.push({
                id: `search-${query}`,
                type: 'stock',
                title: query.toUpperCase(),
                subtitle: `View ${query.toUpperCase()} details`,
                icon: <TrendingUp className="h-5 w-5"/>,
                action: () => router.push(`/${query.toUpperCase()}`)
            });
        }

        setResults(searchResults);
        setSelectedIndex(0);
    }, [query, router]);

    const getDefaultCommands = useCallback(() => {
        return [
            {
                id: 'home',
                type: 'navigation',
                title: 'Home',
                subtitle: 'Go to dashboard',
                icon: <Home className="h-5 w-5"/>,
                action: () => router.push('/')
            },
            {
                id: 'watchlist',
                type: 'navigation',
                title: 'Watchlist',
                subtitle: 'View your watchlist',
                icon: <Activity className="h-5 w-5"/>,
                action: () => router.push('/')
            }
        ];
    }, [router]);

    const handleSelect = (item) => {
        if (item.action) {
            item.action();
        }
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Command Palette */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
                <Card className="shadow-2xl">
                    <div className="flex items-center gap-3 p-4 border-b">
                        <Search className="h-5 w-5 text-muted-foreground"/>
                        <Input
                            autoFocus
                            placeholder="Search stocks, commands... (⌘K)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 text-base"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5"/>
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {results.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No results found</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {results.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                            index === selectedIndex
                                                ? 'bg-accent text-accent-foreground'
                                                : 'hover:bg-accent/50'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 text-muted-foreground">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.title}</p>
                                            {item.subtitle && (
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>
                                        {item.type && (
                                            <Badge variant="outline" className="flex-shrink-0">
                                                {item.type}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className="border-t p-3 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
							<span className="flex items-center gap-1">
								<kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> Navigate
							</span>
                            <span className="flex items-center gap-1">
								<kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> Select
							</span>
                            <span className="flex items-center gap-1">
								<kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> Close
							</span>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}
