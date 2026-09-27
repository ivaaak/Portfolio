import React from 'react';
import { getTagColor } from './utils/getTagColor';
import styles from './Tag.module.css';

export const Tag: React.FC<{ name: string; size?: 'sm' | 'md' }> = ({ name, size = 'sm' }) => (
  <span
    className={`${styles.tag} ${size === 'md' ? styles.md : ''}`}
    style={{ '--tag': getTagColor(name) } as React.CSSProperties}
  >
    {name}
  </span>
);

export default Tag;
