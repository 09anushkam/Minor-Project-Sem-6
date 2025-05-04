import './styles/Theory.css';

const Theory3 = () => {
    return (
        <div className="theory-container">
            <h1 className="theory-title">Sentiment Analysis</h1>

            <div className="section">
                <h2>What is Sentiment Analysis?</h2>
                <p>
                    Sentiment Analysis, also called opinion mining, is an NLP technique that detects emotional tone in text. It classifies opinions and attitudes as positive, negative, or neutral.
                </p>
                <ul className="list-disc">
                    <li>Social media monitoring</li>
                    <li>Customer feedback analysis</li>
                    <li>Product reviews</li>
                    <li>Brand reputation management</li>
                </ul>
            </div>

            <div className="section">
                <h2>Types of Sentiment</h2>
                <ul className="list-disc">
                    <li><strong>Positive:</strong> Satisfaction or praise</li>
                    <li><strong>Negative:</strong> Dissatisfaction or criticism</li>
                    <li><strong>Neutral:</strong> Factual or indifferent tone</li>
                </ul>
            </div>

            <div className="section">
                <h2>Process of Sentiment Analysis</h2>
                <dl>
                    <dt>Data Collection</dt>
                    <dd>Collect data from social media, reviews, or public datasets (e.g., Kaggle).</dd>

                    <dt>Text Preprocessing</dt>
                    <dd>Lowercasing, removing stopwords/special characters, tokenization, and optionally stemming/lemmatization.</dd>

                    <dt>Feature Extraction</dt>
                    <dd>Convert text to numerical format using Bag of Words, TF-IDF, or embeddings (Word2Vec, GloVe).</dd>

                    <dt>Modeling & Classification</dt>
                    <dd>Use ML or DL models like Naïve Bayes, SVM, Logistic Regression, or BERT.</dd>
                </dl>
            </div>

            <div className="section">
                <h2>Algorithm Example: Naive Bayes Classifier</h2>
                <p>
                    Naive Bayes uses Bayes&apos; Theorem to compute probabilities for classification:
                </p>
                <p className="formula">
                    <strong>P(A∣B) = (P(B∣A) × P(A)) / P(B)</strong>
                </p>
                <p>
                    It performs well for text classification due to simplicity and efficiency.
                </p>
                <ul className="list-disc">
                    <li><strong>P(A∣B):</strong> Probability of sentiment A given text B</li>
                    <li><strong>P(B∣A):</strong> Likelihood of text B given sentiment A</li>
                    <li><strong>P(A):</strong> Prior probability of sentiment A</li>
                    <li><strong>P(B):</strong> Prior probability of text B</li>
                </ul>
            </div>

            <div className="section">
                <h2>Evaluation Metrics</h2>
                <div className="table-wrapper">
                    <table className="theory-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Description</th>
                                <th>Formula</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Accuracy</td>
                                <td>Correct predictions over total samples</td>
                                <td>(TP + TN) / (TP + TN + FP + FN)</td>
                            </tr>
                            <tr>
                                <td>Precision</td>
                                <td>Correct positive predictions over total predicted positives</td>
                                <td>TP / (TP + FP)</td>
                            </tr>
                            <tr>
                                <td>Recall</td>
                                <td>Correct positive predictions over all actual positives</td>
                                <td>TP / (TP + FN)</td>
                            </tr>
                            <tr>
                                <td>F1 Score</td>
                                <td>Harmonic mean of precision and recall</td>
                                <td>2 × (Precision × Recall) / (Precision + Recall)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ul className="list-disc">
                    <li><strong>TP:</strong> True Positives</li>
                    <li><strong>TN:</strong> True Negatives</li>
                    <li><strong>FP:</strong> False Positives</li>
                    <li><strong>FN:</strong> False Negatives</li>
                </ul>
            </div>

            <div className="section">
                <h2>Applications</h2>
                <ul className="list-disc">
                    <li>Analyzing political opinions</li>
                    <li>Improving product features from reviews</li>
                    <li>Brand sentiment tracking</li>
                    <li>Detecting hate speech</li>
                </ul>
            </div>

            <div className="section final-thoughts">
                Sentiment analysis empowers machines to understand emotions in text — enabling smarter decisions across industries.
            </div>
        </div>
    );
};

export default Theory3;
