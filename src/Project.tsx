import React, { useState } from 'react';
import Draggable from 'react-draggable';
import reposData from './repo.json';
import './App.css';
import { getTagColor } from './utils/getTagColor';
import { RepoData } from './utils/RepoData';
import { Dialog } from './Dialog';

export const GitHubRepo: React.FC = () => {
    const [repos, setRepos] = useState<RepoData[]>(
        (reposData as RepoData[]).map(repo => ({ ...repo, visible: true }))
    );
    const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);

    const handleClose = (id: number) => {
        setRepos(prevRepos =>
            prevRepos.map(repo =>
                repo.id === id ? { ...repo, visible: false } : repo
            )
        );
    };

    const handleMaximize = (repo: RepoData) => {
        setSelectedRepo(repo);
    };

    return (
        <>
            <div className="github-repos">
                {repos.map((repo) => (
                    <Draggable key={repo.id}>
                        <div className={`project-window ${repo.visible ? '' : 'hidden-project'}`}>
                            <div className="window-top-bar">
                                <div className="window-buttons">
                                    <div className="close-button"
                                        onClick={() => handleClose(repo.id)}
                                    ></div>
                                    <div className="minimize-button"
                                        onClick={() => handleClose(repo.id)}
                                    ></div>
                                    <div
                                        className="maximize-button"
                                        onClick={() => handleMaximize(repo)}
                                    ></div>                                </div>
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
                                {repo.image && <img src={repo.image} />}
                                <p>{repo.description || 'No description available'}</p>
                            </div>
                        </div>
                    </Draggable>
                ))}
            </div>
            {selectedRepo && (
                <Dialog 
                    repo={selectedRepo} 
                    onClose={() => setSelectedRepo(null)} 
                />
            )}
        </>
    );
};