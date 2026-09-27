export const getTagColor = (tag: string): string => {
    const lowercaseTag = tag.toLowerCase();
    switch (lowercaseTag) {
        case '.net':
            return '#7b5cf0'; // Purple for .NET
        case 'c#':
            return '#9b4fd8'; // Violet for C#
        case 'react':
            return '#1fb6d9'; // Cyan for React
        case 'vue':
            return '#3fb27f'; // Green for Vue
        case 'angular':
            return '#dd0031'; // Red for Angular
        case 'express':
            return '#8a93a3'; // Slate for Express
        case 'solidity':
            return '#8a93a3'; // Slate for Solidity
        case 'ethers.js':
        case 'web3':
            return '#f08c2e'; // Orange for Web3
        case 'typescript':
            return '#3178c6'; // Blue for Typescript
        case 'javascript':
            return '#e0b400'; // Yellow for Javascript
        case 'java':
            return '#e76f00'; // Orange for Java
        case 'ai/ml':
            return '#e0468a'; // Pink for AI/ML
        case 'three.js':
        case 'opengl':
            return '#5a6bd6'; // Indigo for 3D
        case 'unity':
        case 'mobile':
            return '#4c9a8a'; // Teal for Unity / Mobile
        default:
            return '#8a93a3'; // Default slate
    }
};
