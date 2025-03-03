import React, { useState, useEffect } from 'react';
import { RepoData } from './utils/RepoData';
import styles from './Sidebar.module.css';

interface SidebarProps {
  repos: RepoData[];
  onRepoSelect: (repo: RepoData) => void;
  onToggle?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ repos, onRepoSelect, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Notify parent component when sidebar state changes
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </div>
      
      {!isCollapsed && (
        <div className={styles.content}>
          <ul className={styles.projectList}>
            {repos
              .filter(repo => repo.visible)
              .map(repo => (
                <li 
                  key={repo.id} 
                  className={styles.projectItem}
                  onClick={() => onRepoSelect(repo)}
                >
                  <span className={styles.projectName}>{repo.name}</span>
                  {/* {repo.tags && repo.tags.length > 0 && (
                    <div className={styles.tagList}>
                      {repo.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                      {repo.tags.length > 2 && (
                        <span className={styles.moreTag}>+{repo.tags.length - 2}</span>
                      )}
                    </div>
                  )} */}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;