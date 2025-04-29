import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Wordcloud } from '@visx/wordcloud';

const WordCloudVisx = ({ words }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

    const fontScale = (word) => {
        const maxFontSize = Math.max(dimensions.width / 18, 12);
        return Math.min(word.value * 8 + 8, maxFontSize);
    };
    const rotate = () => (Math.random() > 0.5 ? 0 : 90);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                const safeWidth = width > 320 ? width : 320;
                setDimensions({ width: safeWidth, height: safeWidth * 0.6 });
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef}
            style={{
                width: '100%',
                minHeight: '200px',
                overflowX: 'auto',
                padding: '10px 0',
                textAlign: 'left',
            }}
        >
            <svg width={dimensions.width} height={dimensions.height} style={{ maxWidth: '100%', height: 'auto' }}>
                <Wordcloud
                    words={words.slice(0, 100)}
                    width={dimensions.width}
                    height={dimensions.height}
                    fontSize={fontScale}
                    font={'Arial'}
                    padding={1}
                    rotate={rotate}
                    spiral="archimedean"
                    random={() => 0.5}
                >
                    {(cloudWords) =>
                        cloudWords.map((word, i) => (
                            <text
                                key={word.text + i}
                                textAnchor="middle"
                                transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                                fontSize={word.size}
                                fontFamily="Arial"
                                fill={['#00C49F', '#FFBB28', '#FF5E5E'][i % 3]}
                            >
                                {word.text}
                            </text>
                        ))
                    }
                </Wordcloud>
            </svg>

            <div className="word-legend">
                <h5>🔤 All Keywords:</h5>
                <ul style={{ columns: 2, fontSize: '14px', paddingLeft: '20px' }}>
                    {words.map((word, idx) => (
                        <li key={idx}>
                            <strong>{word.text}</strong>: {word.value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

WordCloudVisx.propTypes = {
    words: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default WordCloudVisx;
