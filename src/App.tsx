import React, { useState } from 'react';
import Draggable from 'react-draggable';
import reposData from './repo.json';
import styles from './App.module.css';
import { getTagColor } from './utils/getTagColor';
import { RepoData } from './utils/RepoData';
import { Dialog } from './Dialog';
import { Sidebar } from './Sidebar';

export const App: React.FC = () => {
  const [repos, setRepos] = useState<RepoData[]>(
    (reposData as RepoData[]).map(repo => ({ ...repo, visible: true }))
  );
  const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handleClose = (id: number) => {
    setRepos(prevRepos =>
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
  };

  const handleDragStop = () => {
    setDraggingId(null);
  };

  return (
    <>
      <Sidebar
        repos={repos}
        onRepoSelect={handleMaximize}
        onToggle={handleSidebarToggle}
      />

      <div className={`${styles.githubRepos} ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        {repos.map((repo) => (
          <Draggable
            key={repo.id}
            handle=".handle"
            bounds="parent"
            onStart={() => handleDragStart(repo.id)}
            onStop={handleDragStop}
          >
            <div
              className={`${styles.projectWindow} ${repo.visible ? '' : styles.hiddenProject} ${draggingId === repo.id ? styles.dragging : ''}`}
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
                {repo.image && <img src={repo.image} alt={repo.name} className={styles.projectImage}  onClick={() => handleMaximize(repo)} />}
                <p>{repo.description || 'No description available'}</p>
              </div>
            </div>
          </Draggable>
        ))}
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