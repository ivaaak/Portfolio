import React, { useState, useCallback, useMemo, useEffect } from 'react';
import reposData from './repo.json';
import styles from './App.module.css';
import { RepoData } from './utils/RepoData';
import { Dialog } from './Dialog';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ProjectCard } from './ProjectCard';

const MOBILE_QUERY = '(max-width: 900px)';

export const App: React.FC = () => {
    const [allRepos, setAllRepos] = useState<RepoData[]>(
        (reposData as RepoData[]).map(repo => ({ ...repo, tags: repo.tags ?? [], visible: true }))
    );
    const [filteredIds, setFilteredIds] = useState<Set<number> | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [lastDraggedId, setLastDraggedId] = useState<number | null>(null);

    useEffect(() => {
        const media = window.matchMedia(MOBILE_QUERY);
        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
            setIsSidebarCollapsed(e.matches);
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    // Closed windows stay closed, and filters survive closing a window
    const visibleRepos = useMemo(() => allRepos.filter(repo => repo.visible), [allRepos]);
    const displayedRepos = useMemo(
        () => visibleRepos.filter(repo => !filteredIds || filteredIds.has(repo.id)),
        [visibleRepos, filteredIds]
    );
    const closedCount = allRepos.length - visibleRepos.length;

    const handleClose = useCallback((id: number) => {
        setAllRepos(prevRepos =>
            prevRepos.map(repo => (repo.id === id ? { ...repo, visible: false } : repo))
        );
    }, []);

    const handleRestoreAll = useCallback(() => {
        setAllRepos(prevRepos => prevRepos.map(repo => ({ ...repo, visible: true })));
    }, []);

    const handleOpen = useCallback((repo: RepoData) => {
        setSelectedRepo(repo);
        if (window.matchMedia(MOBILE_QUERY).matches) {
            setIsSidebarCollapsed(true);
        }
    }, []);

    const handleSidebarToggle = useCallback(() => {
        setIsSidebarCollapsed(prev => !prev);
    }, []);

    const handleDragStart = useCallback((id: number) => {
        setDraggingId(id);
        setLastDraggedId(id);
    }, []);

    const handleDragStop = useCallback(() => {
        setDraggingId(null);
    }, []);

    const handleFilterChange = useCallback((filteredRepos: RepoData[]) => {
        setFilteredIds(new Set(filteredRepos.map(repo => repo.id)));
    }, []);

    return (
        <>
            <Sidebar
                repos={displayedRepos}
                collapsed={isSidebarCollapsed}
                onRepoSelect={handleOpen}
                onToggle={handleSidebarToggle}
            />

            {isMobile && !isSidebarCollapsed && (
                <div className={styles.scrim} onClick={handleSidebarToggle} />
            )}

            <div className={`${styles.contentContainer} ${isSidebarCollapsed || isMobile ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
                <TopBar
                    repos={allRepos}
                    shownCount={displayedRepos.length}
                    closedCount={closedCount}
                    onRestoreAll={handleRestoreAll}
                    onFilterChange={handleFilterChange}
                    onMenuClick={handleSidebarToggle}
                />

                <main className={styles.githubRepos}>
                    {displayedRepos.map(repo => (
                        <ProjectCard
                            key={repo.id}
                            repo={repo}
                            isDragging={draggingId === repo.id}
                            isLastDragged={lastDraggedId === repo.id}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            onDragStart={handleDragStart}
                            onDragStop={handleDragStop}
                        />
                    ))}

                    {displayedRepos.length === 0 && (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No projects match</p>
                            <p className={styles.emptyText}>Try a different search term or clear the tag filters.</p>
                            {closedCount > 0 && (
                                <button className={styles.emptyButton} onClick={handleRestoreAll}>
                                    Reopen {closedCount} closed {closedCount === 1 ? 'window' : 'windows'}
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {selectedRepo && (
                <Dialog
                    repo={selectedRepo}
                    onClose={() => setSelectedRepo(null)}
                />
            )}
        </>
    );
};

export default App;
