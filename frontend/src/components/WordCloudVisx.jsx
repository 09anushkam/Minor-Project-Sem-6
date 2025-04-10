import PropTypes from 'prop-types';
import { Wordcloud } from '@visx/wordcloud';

const WordCloudVisx = ({ words }) => {
    const fontScale = (word) => word.value * 0.5 + 10;
    const rotate = () => ~~(Math.random() * 2) * 90;

    return (
        <svg width={500} height={300}>
            <Wordcloud
                words={words.slice(0, 100)} // max 100 common words
                width={500}
                height={300}
                fontSize={fontScale}
                font={'Arial'}
                padding={2}
                rotate={rotate}
                spiral="archimedean"
                random={() => 0.5}
            >
                {(cloudWords) =>
                    cloudWords.map((word, i) => (
                        <text
                            key={word.text}
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
