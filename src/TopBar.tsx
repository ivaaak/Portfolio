import React, { useState, useEffect } from 'react';
import { RepoData } from './utils/RepoData';
import styles from './TopBar.module.css';

interface TopBarProps {
  repos: RepoData[];
  onFilterChange: (filteredRepos: RepoData[]) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ repos, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Extract all unique tags when repos change
  useEffect(() => {
    const tagSet = new Set<string>();
    repos.forEach(repo => {
      if (repo.tags) {
        repo.tags.forEach(tag => tagSet.add(tag));
      }
    });
    setAvailableTags(Array.from(tagSet).sort());
  }, [repos]);

  useEffect(() => {
    const filteredRepos = repos.filter(repo => {
      const nameMatches = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedTags.length === 0) {
        return nameMatches;
      }
      
      const hasSelectedTag = repo.tags ? 
        repo.tags.some(tag => selectedTags.includes(tag)) : 
        false;
      
      return nameMatches && hasSelectedTag;
    });
    
    onFilterChange(filteredRepos);
  }, [searchTerm, selectedTags, repos, onFilterChange]);

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
        {/* {searchTerm && (
          <button onClick={() => setSearchTerm('')} className={styles.clearButton}>
            ×
          </button>
        )} */}
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
    </div>
  );
};

export default TopBar;