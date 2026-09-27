import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { RepoData } from './utils/RepoData';
import { Tag } from './Tag';
import { GitHubIcon } from './Icons';
import styles from './Dialog.module.css';

interface DialogProps {
  repo: RepoData;
  onClose: () => void;
}

// GitHub returns base64 content; decode as UTF-8 so emoji and non-latin text render correctly
const decodeBase64Utf8 = (content: string) => {
  const binary = atob(content.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, ch => ch.charCodeAt(0)));
};

// Resolve relative README links/images against the repo so they don't break
const resolveUrl = (url: string | undefined, base: string | null) => {
  if (!url || !base || /^(https?:|mailto:|data:|#)/i.test(url)) return url;
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
};

export const Dialog: React.FC<DialogProps> = ({ repo, onClose }) => {
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeBase, setReadmeBase] = useState<string | null>(null);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setReadme(null);
    setReadmeError(null);

    const fetchReadme = async () => {
      try {
        const [, , , owner, repoName] = repo.html_url.split('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`);

        if (!response.ok) {
          throw new Error('README not found');
        }

        const data = await response.json();
        if (cancelled) return;
        setReadme(decodeBase64Utf8(data.content));
        setReadmeBase(data.download_url ?? null);
      } catch (error) {
        if (cancelled) return;
        setReadmeError('Could not load the README for this project.');
        console.error('Error fetching README:', error);
      }
    };

    fetchReadme();
    return () => { cancelled = true; };
  }, [repo.html_url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const components = {
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        {...props}
        src={resolveUrl(src, readmeBase)}
        alt={alt}
        loading="lazy"
        className={styles.readmeImage}
      />
    ),
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        {...props}
        href={resolveUrl(href, `${repo.html_url}/blob/HEAD/`)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div className={styles.dialogContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={repo.name}>
        <div className={styles.windowTopBar}>
          <div className={styles.windowButtons}>
            <button className={styles.dialogCloseButton} onClick={onClose} aria-label="Close" title="Close" />
            <span className={styles.inactiveLight} />
            <span className={styles.inactiveLight} />
          </div>
          <div className={styles.windowTitle}>{repo.name}</div>
          <div className={styles.windowButtonsSpacer} />
        </div>

        <div className={styles.projectContent}>
          <div className={styles.hero}>
            {repo.image && (
              <div className={styles.imageFrame}>
                <img src={repo.image} className={styles.dialogImage} alt={repo.name} />
              </div>
            )}
            <div className={styles.meta}>
              <h2 className={styles.projectTitle}>{repo.name}</h2>
              <p className={styles.description}>{repo.description || 'No description available.'}</p>
              {repo.tags && repo.tags.length > 0 && (
                <div className={styles.tags}>
                  {repo.tags.map(tag => <Tag key={tag} name={tag} size="md" />)}
                </div>
              )}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
              >
                <GitHubIcon /> View on GitHub
              </a>
            </div>
          </div>

          <div className={styles.readmeHeader}>README.md</div>
          {readmeError ? (
            <p className={styles.status}>{readmeError}</p>
          ) : readme ? (
            <div className={styles.readmeContent}>
              <ReactMarkdown
                components={components}
                rehypePlugins={[rehypeRaw]}
              >{readme}</ReactMarkdown>
            </div>
          ) : (
            <div className={styles.skeleton} aria-label="Loading README">
              <span /><span /><span /><span />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
