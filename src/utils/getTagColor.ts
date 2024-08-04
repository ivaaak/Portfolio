export const getTagColor = (tag: string): string => {
    const lowercaseTag = tag.toLowerCase();
    switch (lowercaseTag) {
        case '.net':
            return '#512BD4'; // Purple for .NET
        case 'react':
            return '#61DAFB'; // Light blue for React
        case 'vue':
            return '#4FC08D'; // Green for Vue
        case 'angular':
            return '#DD0031'; // Red for Angular
        case 'express':
            return '#000000'; // Black for Express
        default:
            return '#6c757d'; // Default gray color
    }
};