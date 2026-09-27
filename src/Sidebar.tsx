import React from 'react';
import { RepoData } from './utils/RepoData';
import { getTagColor } from './utils/getTagColor';
import { ChevronIcon } from './Icons';
import styles from './Sidebar.module.css';

interface SidebarProps {
  repos: RepoData[];
  collapsed: boolean;
  onRepoSelect: (repo: RepoData) => void;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ repos, collapsed, onRepoSelect, onToggle }) => {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`} aria-hidden={collapsed}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>iv</span>
          <div className={styles.brandText}>
            <span className={styles.brandName}>ivaaak</span>
            <span className={styles.brandSub}>Projects</span>
          </div>
        </div>
        <button className={styles.toggleButton} onClick={onToggle} aria-label="Collapse sidebar" title="Collapse sidebar" tabIndex={collapsed ? -1 : 0}>
          <ChevronIcon />
        </button>
      </div>

      <div className={styles.sectionLabel}>
        <span>All projects</span>
        <span className={styles.count}>{repos.length}</span>
      </div>

      <nav className={styles.content}>
        <ul className={styles.projectList}>
          {repos.map(repo => (
            <li key={repo.id}>
              <button
                className={styles.projectItem}
                onClick={() => onRepoSelect(repo)}
                title={repo.name}
                tabIndex={collapsed ? -1 : 0}
              >
                <span className={styles.dot} style={{ background: getTagColor(repo.tags?.[0] ?? '') }} />
                <span className={styles.projectName}>{repo.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
