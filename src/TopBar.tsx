import React, { useState, useMemo, useEffect } from 'react';
import { RepoData } from './utils/RepoData';
import { getTagColor } from './utils/getTagColor';
import { CloseIcon, GitHubIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './Icons';
import { useTheme } from './utils/useTheme';
import styles from './TopBar.module.css';

const AVATAR_URL = 'https://avatars.githubusercontent.com/u/43663336?v=4';
const SKILLS = ['React', 'Angular', 'Vue', '.NET', 'Java', 'Express', 'TypeScript', 'JavaScript', 'Web3', 'AI / LLMs'];

interface DevDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperDialog: React.FC<DevDialogProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div className={styles.dialogContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="About me">
        <div className={styles.dialogBanner} />
        <button className={styles.closeButton} onClick={onClose} aria-label="Close"><CloseIcon /></button>
        <div className={styles.developerInfo}>
          <img className={styles.avatarLarge} src={AVATAR_URL} alt="Ivaylo Pavlov" />
          <h3 className={styles.devName}>Ivaylo Pavlov</h3>
          <p className={styles.jobTitle}>Fullstack Developer · .NET / Java / Express · Angular / React / Vue</p>
          <p className={styles.introduction}>
            Passionate fullstack developer with expertise in both backend (.NET, Java, Express)
            and frontend (Angular, React, Vue, TypeScript) technologies. Building modern web applications
            with clean, maintainable code.
          </p>

          <div className={styles.section}>
            <h4>Skills</h4>
            <div className={styles.skillTags}>
              {SKILLS.map(skill => <span key={skill}>{skill}</span>)}
            </div>
          </div>

          <div className={styles.section}>
            <h4>Currently working at</h4>
            <div className={styles.companyInfo}>
              <span className={styles.companyName}>blubito</span>
              <span className={styles.location}>Sofia</span>
            </div>
          </div>

          <div className={styles.links}>
            <a className={styles.primaryLink} href="https://github.com/ivaaak" target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> GitHub
            </a>
            <a className={styles.secondaryLink} href="mailto:ivaaakpavlov@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TopBarProps {
  repos: RepoData[];
  shownCount: number;
  closedCount: number;
  onRestoreAll: () => void;
  onFilterChange: (filteredRepos: RepoData[]) => void;
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ repos, shownCount, closedCount, onRestoreAll, onFilterChange, onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Tags derived from the data, most used first
  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach(repo => repo.tags?.forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
  }, [repos]);

  const filteredRepos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return repos.filter(repo => {
      const textMatches = !term
        || repo.name.toLowerCase().includes(term)
        || repo.description?.toLowerCase().includes(term);

      if (selectedTags.length === 0) {
        return textMatches;
      }

      const hasSelectedTag = repo.tags ? repo.tags.some(tag => selectedTags.includes(tag)) : false;
      return textMatches && hasSelectedTag;
    });
  }, [searchTerm, selectedTags, repos]);

  useEffect(() => {
    onFilterChange(filteredRepos);
  }, [filteredRepos, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const hasFilters = searchTerm !== '' || selectedTags.length > 0;

  return (
    <>
    <header className={styles.topBar}>
      <div className={styles.mainRow}>
        <button className={styles.iconButton} onClick={onMenuClick} aria-label="Toggle project list" title="Toggle project list">
          <MenuIcon />
        </button>

        <div className={styles.heading}>
          <h1 className={styles.title}>Projects</h1>
          <span className={styles.subtitle}>{shownCount} shown</span>
        </div>

        <div className={styles.searchContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Search projects…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Search projects"
          />
        </div>

        <button
          className={`${styles.iconButton} ${styles.themeButton}`}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <button className={styles.avatarButton} onClick={() => setIsDialogOpen(true)} aria-label="About me" title="About me">
          <img className={styles.avatar} src={AVATAR_URL} alt="" />
        </button>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.tagsContainer}>
          {availableTags.map(({ tag, count }) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                className={`${styles.tagButton} ${selected ? styles.tagSelected : ''}`}
                style={{ '--tag': getTagColor(tag) } as React.CSSProperties}
                onClick={() => handleTagToggle(tag)}
                aria-pressed={selected}
              >
                <span className={styles.tagDot} />
                {tag}
                <span className={styles.tagCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {(hasFilters || closedCount > 0) && (
          <div className={styles.actions}>
            {closedCount > 0 && (
              <button onClick={onRestoreAll} className={styles.textButton}>
                Reopen {closedCount} closed
              </button>
            )}
            {hasFilters && (
              <button onClick={clearFilters} className={styles.textButton}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </header>

    <DeveloperDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
};

export default TopBar;
