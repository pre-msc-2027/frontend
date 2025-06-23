import React, { type ReactNode } from 'react';
import './Blob.css';

type BlobProps = {
    children?: ReactNode;
    colors?: string[];
};

const defaultColors = [
    'rgb(0,100,206)',
    'rgb(237,47,108)',
    'rgb(0,100,206)'
];

const Blob: React.FC<BlobProps> = ({ children, colors = defaultColors }) => {
    return (
        <div className="blob-wrapper">
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={`blob blob-${index + 1}`}
                    style={{ background: color }}
                />
            ))}
            <div className="blob-content">{children}</div>
        </div>
    );
};

export default Blob;
