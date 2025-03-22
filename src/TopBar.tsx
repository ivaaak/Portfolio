import React, { useState, useMemo } from 'react';
import { RepoData } from './utils/RepoData';
import styles from './TopBar.module.css';

// Developer Dialog component
interface DevDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperDialog: React.FC<DevDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>About Me</h2>
        <div className={styles.developerInfo}>
          <div className={styles.avatarLarge}>
            <img src="https://avatars.githubusercontent.com/u/43663336?v=4" alt="Ivaylo Pavlov" />
          </div>
          <div className={styles.developerDetails}>
            <h3>Ivaylo Pavlov</h3>
            <p className={styles.jobTitle}>Fullstack Developer (.NET/Java/Express and Angular/React/Vue/TS)</p>
            <p className={styles.introduction}>
              Passionate fullstack developer with expertise in both backend (.NET, Java, Express) 
              and frontend (Angular, React, Vue, TypeScript) technologies. Building modern web applications 
              with clean, maintainable code.
            </p>
            <div className={styles.skills}>
              <h4>Skills</h4>
              <div className={styles.skillTags}>
                <span>React</span>
                <span>Angular</span>
                <span>Vue</span>
                <span>.NET</span>
                <span>Java</span>
                <span>Express</span>
                <span>TypeScript</span>
                <span>JavaScript</span>
                <span>Web3</span>
                <span>AI / LLMs</span>

              </div>
            </div>
            <div className={styles.company}>
              <h4>Currently working at</h4>
              <div className={styles.companyInfo}>
                <span className={styles.companyName}>blubito</span>
                <span className={styles.location}>Sofia</span>
              </div>
            </div>
            <div className={styles.links}>
              <a href="https://github.com/ivaaak" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="mailto:ivaaakpavlov@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TopBarProps {
  repos: RepoData[];
  onFilterChange: (filteredRepos: RepoData[]) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ repos, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Use a constant array instead of state for available tags
  const availableTags = useMemo(() => 
    ["AI/ML", "Web3", ".NET", "Express", "Java", "React", "Angular", "Vue", "Javascript", "Typescript", "C#", "Unity"],
    []
  );

  // Memoize the filtering logic
  const filteredRepos = useMemo(() => {
    return repos.filter(repo => {
      const nameMatches = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedTags.length === 0) {
        return nameMatches;
      }
      
      const hasSelectedTag = repo.tags ? 
        repo.tags.some(tag => selectedTags.includes(tag)) : 
        false;
      
      return nameMatches && hasSelectedTag;
    });
  }, [searchTerm, selectedTags, repos]);

  // Call onFilterChange only when filteredRepos changes
  React.useEffect(() => {
    onFilterChange(filteredRepos);
  }, [filteredRepos, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.tagFilters}>
        <div className={styles.tagsContainer}>
          {availableTags.map(tag => (
            <button
              key={tag}
              className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.tagSelected : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {(searchTerm || selectedTags.length > 0) && (
          <button onClick={clearFilters} className={styles.clearAllButton}>
            Clear All
          </button>
        )}
      </div>

      <img className={styles.avatar} onClick={toggleDialog} src="https://avatars.githubusercontent.com/u/43663336?v=4 " alt="Developer avatar" />
      
      <DeveloperDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default TopBar;