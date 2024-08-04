import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { RepoData } from './utils/RepoData';
import { getTagColor } from './utils/getTagColor';
import './Dialog.css'

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
        style={{ maxWidth: '100%' }}
        className="readme-image"
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

  console.log("components", components);

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="window-top-bar">
          <div className="window-buttons">
            <div className="dialog-close-button" onClick={onClose}></div>
          </div>
          <div className="window-title">{repo.name}</div>
          <div className="window-tags">
            {repo.tags && repo.tags.map((tag, index) => (
              <span
                key={index}
                className="tag"
                style={{ background: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div className="project-content">
          {repo.image && <img src={repo.image} className='dialog-image' alt={repo.name} />}
          <p>{repo.description || 'No description available'}</p>

          <h2>README: </h2>
          {readmeError ? (
            <p>{readmeError}</p>
          ) : readme ? (
            <div className="readme-content">
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