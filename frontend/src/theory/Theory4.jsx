import "./styles/Theory.css";

const Theory4 = () => {
    return (
        <div className="theory-container">
            <h1 className="theory-title">Topic Modeling</h1>

            <div className="section">
                <h2>What is Topic Modeling?</h2>
                <p>
                    Topic Modeling is an unsupervised learning technique used in Natural Language Processing (NLP) to automatically identify topics present in a collection of documents. It helps to organize, understand, and summarize large volumes of textual data by clustering words that frequently occur together.
                </p>
            </div>

            <div className="section">
                <h2>Latent Dirichlet Allocation (LDA)</h2>
                <p>
                    LDA is one of the most popular topic modeling algorithms. It assumes:
                </p>
                <ul className="list-disc">
                    <li>Each document is a mixture of various topics.</li>
                    <li>Each topic is a mixture of words with associated probabilities.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Mathematical Representation</h2>
                <p>
                    LDA models topic-word distributions probabilistically:
                </p>
                <dl>
                    <dt>P(w ∣ z) = (n(w,z) + β) / (n(z) + Vβ)</dt>
                    <dd>Where:</dd>
                    <dd><strong>w</strong>: word</dd>
                    <dd><strong>z</strong>: topic</dd>
                    <dd><strong>n(w,z)</strong>: frequency of word w in topic z</dd>
                    <dd><strong>V</strong>: vocabulary size</dd>
                    <dd><strong>β</strong>: smoothing parameter</dd>
                </dl>
            </div>

            <div className="section">
                <h2>Procedure</h2>
                <ol className="list-decimal">
                    <li className="procedure-step">Collect textual data (tweets, reviews, comments, etc.).</li>
                    <li className="procedure-step">Preprocess data:
                        <ul className="list-disc">
                            <li>Lowercasing</li>
                            <li>Stopword removal</li>
                            <li>Tokenization</li>
                            <li>Optional: Lemmatization</li>
                        </ul>
                    </li>
                    <li className="procedure-step">Create a dictionary and convert the data into a Bag-of-Words format.</li>
                    <li className="procedure-step">Apply LDA model (e.g., using Gensim or scikit-learn).</li>
                    <li className="procedure-step">Visualize topics and interpret results.</li>
                </ol>
            </div>

            <div className="section">
                <h2>Code Example (Gensim + LDA)</h2>
                <pre>
                    {`import gensim
from gensim import corpora
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

documents = [
  "I love reading books about data science.",
  "Artificial Intelligence and machine learning are exciting fields.",
  "Books on data mining and AI are very informative.",
  "I enjoy exploring machine learning techniques."
]

stop_words = set(stopwords.words('english'))
texts = [[word.lower() for word in word_tokenize(doc)
          if word.isalpha() and word.lower() not in stop_words]
          for doc in documents]

dictionary = corpora.Dictionary(texts)
corpus = [dictionary.doc2bow(text) for text in texts]

lda_model = gensim.models.LdaModel(corpus, num_topics=2, id2word=dictionary, passes=10)

for idx, topic in lda_model.print_topics():
    print(f"Topic {idx + 1}: {topic}")`}
                </pre>
            </div>

            <div className="section">
                <h2>Sample Output</h2>
                <pre>
                    {`Topic 1: 0.150*"data" + 0.140*"books" + 0.130*"science"
Topic 2: 0.180*"machine" + 0.160*"learning" + 0.150*"ai"`}
                </pre>
            </div>

            <div className="section">
                <h2>Advantages</h2>
                <ul className="list-disc">
                    <li>Discovers hidden topics in large text collections.</li>
                    <li>Improves summarization and content recommendation.</li>
                    <li>Useful for clustering and dimensionality reduction.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Limitations</h2>
                <ul className="list-disc">
                    <li>Requires pre-defined number of topics.</li>
                    <li>Highly sensitive to preprocessing quality.</li>
                    <li>Topics may not always be interpretable.</li>
                </ul>
            </div>

            <div className="section final-thoughts">
                <p>
                    🔍 Topic modeling is a powerful way to extract meaning from unstructured text and is widely used in analyzing social media content, reviews, and articles. When paired with strong preprocessing and visualization tools, it can significantly boost insight generation in data analysis workflows.
                </p>
            </div>
        </div>
    );
};

export default Theory4;
