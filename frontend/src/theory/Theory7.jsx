import './styles/Theory.css';

const Theory7 = () => {
    return (
        <div className="theory-container">
            <h1 className="theory-title">TF-IDF</h1>

            <div className="section">
                <h2>What is TF-IDF?</h2>
                <p>
                    TF-IDF stands for <strong>Term Frequency-Inverse Document Frequency</strong>. It is a statistical measure used in Natural Language Processing (NLP) to evaluate how important a word is to a document in a collection (corpus).
                </p>
                <p>
                    Unlike simple word counts, TF-IDF reflects not just how often a word appears, but how unique or informative that word is across the entire corpus.
                </p>
                <p>Common use cases include:</p>
                <ul className="list-disc">
                    <li>Document classification</li>
                    <li>Information retrieval (e.g., search engines)</li>
                    <li>Text clustering and summarization</li>
                    <li>Spam filtering and keyword extraction</li>
                </ul>
            </div>

            <div className="section">
                <h2>Components of TF-IDF</h2>
                <ol className="list-decimal">
                    <li>
                        <strong>Term Frequency (TF)</strong><br />
                        Measures how frequently a term occurs in a document.<br />
                        <code>TF(t) = (Number of times term t appears in the document) / (Total number of terms in the document)</code>
                    </li>
                    <li>
                        <strong>Inverse Document Frequency (IDF)</strong><br />
                        Measures how important a term is across the corpus. Rare terms across documents get higher scores.<br />
                        <code>IDF(t) = log(N / df(t))</code><br />
                        Where:
                        <ul className="list-disc">
                            <li><strong>N:</strong> Total number of documents</li>
                            <li><strong>df(t):</strong> Number of documents containing the term t</li>
                        </ul>
                    </li>
                    <li>
                        <strong>TF-IDF Formula</strong><br />
                        <code>TF-IDF(t, d) = TF(t) × IDF(t)</code><br />
                        Where:
                        <ul className="list-disc">
                            <li><strong>t:</strong> Term</li>
                            <li><strong>d:</strong> Document</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className="section">
                <h2>Procedure</h2>
                <ol className="list-decimal">
                    <li><strong>Collect Text Data:</strong> Gather a set of documents (e.g., sentences, articles, or textual dataset).</li>
                    <li>
                        <strong>Preprocess the Text:</strong>
                        <ul className="list-disc">
                            <li>Convert text to lowercase</li>
                            <li>Remove punctuation, numbers, and special characters</li>
                            <li>Remove stopwords (e.g., &quot;is&quot;, &quot;the&quot;, &quot;and&quot;)</li>
                            <li>Tokenize the text (split into words)</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Apply TF-IDF Vectorization:</strong> Use <code>TfidfVectorizer</code> from Scikit-learn:
                        <pre><code>from sklearn.feature_extraction.text import TfidfVectorizer</code></pre>
                        <ul className="list-disc">
                            <li>Fit the vectorizer on the corpus</li>
                            <li>Transform the documents into TF-IDF vectors</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Analyze the Results:</strong>
                        <ul className="list-disc">
                            <li>View the TF-IDF matrix</li>
                            <li>Identify which words have high importance in each document</li>
                            <li>Visualize top-weighted terms per document (e.g., bar graphs or word clouds)</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className="section">
                <h2>Example</h2>
                <p>Suppose we have 3 simple documents:</p>
                <pre><code>{`documents = [
  "the sky is blue",
  "the sun is bright",
  "the sun in the blue sky is bright"
]`}</code></pre>

                <p><strong>Step 1: Import and Initialize</strong></p>
                <pre><code>{`from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(documents)`}</code></pre>

                <p><strong>Step 2: Display TF-IDF Matrix</strong></p>
                <pre><code>{`import pandas as pd

df = pd.DataFrame(X.toarray(), columns=vectorizer.get_feature_names_out())
print(df)`}</code></pre>

                <p><strong>Sample Output:</strong></p>
                <div className="table-wrapper">
                    <table className="theory-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>blue</th>
                                <th>bright</th>
                                <th>in</th>
                                <th>is</th>
                                <th>sky</th>
                                <th>sun</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Doc 1</td>
                                <td>0.58</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>0.58</td>
                                <td>0.58</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Doc 2</td>
                                <td>0.00</td>
                                <td>0.71</td>
                                <td>0.00</td>
                                <td>0.50</td>
                                <td>0.00</td>
                                <td>0.50</td>
                            </tr>
                            <tr>
                                <td>Doc 3</td>
                                <td>0.41</td>
                                <td>0.50</td>
                                <td>0.50</td>
                                <td>0.41</td>
                                <td>0.41</td>
                                <td>0.50</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>We observe:</p>
                <ul className="list-disc">
                    <li>The word <strong>&quot;bright&quot;</strong> is important in Doc 2 and Doc 3.</li>
                    <li>The word <strong>&quot;blue&quot;</strong> is more relevant to Doc 1 and Doc 3.</li>
                    <li>Common words like <strong>&quot;the&quot;</strong> and <strong>&quot;is&quot;</strong> are automatically filtered out.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Advantages of TF-IDF</h2>
                <ul className="list-disc">
                    <li>Emphasizes informative and rare words</li>
                    <li>Reduces importance of frequent but uninformative words</li>
                    <li>Converts text into a format suitable for ML algorithms</li>
                    <li>Simple and interpretable</li>
                </ul>
            </div>

            <div className="section">
                <h2>Limitations</h2>
                <ul className="list-disc">
                    <li>Does not capture word meaning or context (unlike Word2Vec or BERT)</li>
                    <li>May give high weight to rare but irrelevant words</li>
                    <li>Sensitive to preprocessing quality</li>
                </ul>
            </div>

            <div className="section final-thoughts">
                TF-IDF is a fundamental technique in NLP for transforming raw text into meaningful numerical representations. It plays a crucial role in many applications such as document classification, search engines, and keyword extraction. Understanding and applying TF-IDF lays the groundwork for more advanced text analytics tasks.
            </div>
        </div>
    );
};

export default Theory7;
