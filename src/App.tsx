import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import reposData from './repo.json';
import styles from './App.module.css';
import { getTagColor } from './utils/getTagColor';
import { RepoData } from './utils/RepoData';
import { Dialog } from './Dialog';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const App: React.FC = () => {
    const [allRepos, setAllRepos] = useState<RepoData[]>(
        (reposData as RepoData[]).map(repo => ({ ...repo, visible: true }))
    );
    const [displayedRepos, setDisplayedRepos] = useState<RepoData[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [lastDraggedId, setLastDraggedId] = useState<number | null>(null);

    useEffect(() => {
        setDisplayedRepos(allRepos.filter(repo => repo.visible));
    }, [allRepos]);

    const handleClose = (id: number) => {
        setAllRepos(prevRepos =>
            prevRepos.map(repo =>
                repo.id === id ? { ...repo, visible: false } : repo
            )
        );
    };

    const handleMaximize = (repo: RepoData) => {
        setSelectedRepo(repo);
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setIsSidebarCollapsed(collapsed);
    };

    const handleDragStart = (id: number) => {
        setDraggingId(id);
        setLastDraggedId(id);
    };

    const handleDragStop = () => {
        setDraggingId(null);
    };

    const handleFilterChange = (filteredRepos: RepoData[]) => {
        const visibilityFiltered = filteredRepos.filter(repo => {
            const originalRepo = allRepos.find(r => r.id === repo.id);
            return originalRepo ? originalRepo.visible : true;
        });
        setDisplayedRepos(visibilityFiltered);
    };

    return (
        <>
            <Sidebar
                repos={allRepos.filter(repo => repo.visible)}
                onRepoSelect={handleMaximize}
                onToggle={handleSidebarToggle}
            />

            <div className={`${styles.contentContainer} ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
                <TopBar
                    repos={allRepos}
                    onFilterChange={handleFilterChange}
                />

                <div className={styles.githubRepos}>
                    {displayedRepos.map((repo) => (
                        <Draggable
                            key={repo.id}
                            handle=".handle"
                            bounds="parent"
                            onStart={() => handleDragStart(repo.id)}
                            onStop={handleDragStop}
                        >
                            <div
                                className={`${styles.projectWindow} ${repo.visible ? '' : styles.hiddenProject} ${draggingId === repo.id ? styles.dragging : ''} ${lastDraggedId === repo.id ? styles.lastDragged : ''}`}
                            >
                                <div className={`${styles.windowTopBar} handle`}>
                                    <div className={styles.windowButtons}>
                                        <div className={styles.closeButton}
                                            onClick={() => handleClose(repo.id)}
                                        ></div>
                                        <div className={styles.minimizeButton}
                                            onClick={() => handleClose(repo.id)}
                                        ></div>
                                        <div
                                            className={styles.maximizeButton}
                                            onClick={() => handleMaximize(repo)}
                                        ></div>
                                    </div>
                                    <div className={styles.windowTitle}>
                                        {repo.name}
                                    </div>
                                    <div className={styles.windowTags}>
                                        {repo.tags && repo.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={styles.tag}
                                                style={{ background: getTagColor(tag) }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.githubLink}
                                    >
                                        GitHub
                                    </a>
                                </div>
                                <div className={styles.projectContent}>
                                    {repo.image && <img src={repo.image} alt={repo.name} className={styles.projectImage} onClick={() => handleMaximize(repo)} />}
                                    <p>{repo.description || 'No description available'}</p>
                                </div>
                            </div>
                        </Draggable>
                    ))}
                </div>
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