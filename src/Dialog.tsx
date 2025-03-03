import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { RepoData } from './utils/RepoData';
import { getTagColor } from './utils/getTagColor';
import styles from './Dialog.module.css';

interface DialogProps {
  repo: RepoData;
  onClose: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ repo, onClose }) => {
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const [, , , owner, repoName] = repo.html_url.split('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`);

        if (!response.ok) {
          throw new Error('README not found');
        }

        const data = await response.json();
        const decodedContent = atob(data.content);
        setReadme(decodedContent);
      } catch (error) {
        setReadmeError('Failed to load README');
        console.error('Error fetching README:', error);
      }
    };

    fetchReadme();
  }, [repo.html_url]);

  const components = {
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        {...props}
        src={src}
        alt={alt}
        className={styles.readmeImage}
      />
    ),
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <div className={styles.windowTopBar}>
          <div className={styles.windowButtons}>
            <div className={styles.dialogCloseButton} onClick={onClose}></div>
          </div>
          <div className={styles.windowTitle}>{repo.name}</div>
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
          {repo.image && <img src={repo.image} className={styles.dialogImage} alt={repo.name} />}
          <p>{repo.description || 'No description available'}</p>

          <h2>README: </h2>
          {readmeError ? (
            <p>{readmeError}</p>
          ) : readme ? (
            <div className={styles.readmeContent}>
              <ReactMarkdown
                components={components}
                rehypePlugins={[rehypeRaw]}
              >{readme}</ReactMarkdown>
            </div>
          ) : (
            <p>Loading README...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;