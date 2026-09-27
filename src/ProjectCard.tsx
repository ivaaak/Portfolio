import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { RepoData } from './utils/RepoData';
import { getTagColor } from './utils/getTagColor';
import { Tag } from './Tag';
import { CodeIcon, ExpandIcon, GitHubIcon } from './Icons';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  repo: RepoData;
  isDragging: boolean;
  isLastDragged: boolean;
  onClose: (id: number) => void;
  onOpen: (repo: RepoData) => void;
  onDragStart: (id: number) => void;
  onDragStop: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  repo,
  isDragging,
  isLastDragged,
  onClose,
  onOpen,
  onDragStart,
  onDragStop,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const tags = repo.tags ?? [];
  const accent = getTagColor(tags[0] ?? '');
  const showImage = repo.image && !imageFailed;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      cancel="button, a"
      bounds="parent"
      onStart={() => onDragStart(repo.id)}
      onStop={onDragStop}
    >
      <div
        ref={nodeRef}
        className={`${styles.window} ${isDragging ? styles.dragging : ''} ${isLastDragged ? styles.lastDragged : ''}`}
      >
        <div className={`${styles.titleBar} handle`}>
          <div className={styles.trafficLights}>
            <button className={`${styles.light} ${styles.close}`} onClick={() => onClose(repo.id)} aria-label={`Close ${repo.name}`} title="Close" />
            <button className={`${styles.light} ${styles.minimize}`} onClick={() => onClose(repo.id)} aria-label={`Minimize ${repo.name}`} title="Minimize" />
            <button className={`${styles.light} ${styles.maximize}`} onClick={() => onOpen(repo)} aria-label={`Open ${repo.name}`} title="Open details" />
          </div>
          <div className={styles.title} title={repo.name}>{repo.name}</div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label={`${repo.name} on GitHub`}
            title="View on GitHub"
          >
            <GitHubIcon />
          </a>
        </div>

        <button className={styles.preview} onClick={() => onOpen(repo)} aria-label={`Open ${repo.name} details`}>
          {showImage ? (
            <img src={repo.image} alt="" loading="lazy" className={styles.image} onError={() => setImageFailed(true)} draggable={false} />
          ) : (
            <div className={styles.placeholder} style={{ '--accent': accent } as React.CSSProperties}>
              <CodeIcon />
              <span>{repo.html_url.replace(/^https?:\/\/github\.com\//, '')}</span>
            </div>
          )}
          <span className={styles.expandHint}><ExpandIcon /> Details</span>
        </button>

        <div className={styles.body}>
          <p className={styles.description}>{repo.description || 'No description available.'}</p>
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map(tag => <Tag key={tag} name={tag} />)}
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default ProjectCard;
