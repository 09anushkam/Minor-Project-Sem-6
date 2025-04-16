import pandas as pd
import sys, json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

def log(message):
    print(f"[PYTHON] {message}", file=sys.stderr, flush=True)

def preprocess(text):
    return str(text).lower()

def topic_modeling(file_path, num_topics):
    df = pd.read_csv(file_path)

    if 'text' not in df.columns:
        log("CSV does not contain 'text' column.")
        raise SystemExit(1)

    texts = df['text'].dropna().apply(preprocess)

    if texts.empty:
        log("No valid text entries found in CSV.")
        raise SystemExit(1)

    vectorizer = CountVectorizer(stop_words='english', max_df=0.9, min_df=2)
    doc_term_matrix = vectorizer.fit_transform(texts)

    if doc_term_matrix.shape[1] == 0:
        log("Vectorized document-term matrix is empty.")
        raise SystemExit(1)

    lda = LatentDirichletAllocation(n_components=num_topics, random_state=42)
    lda.fit(doc_term_matrix)

    terms = vectorizer.get_feature_names_out()
    topics = {}
    topic_distribution = [0] * num_topics
    topic_samples = {f"Topic {i+1}": [] for i in range(num_topics)}

    for idx, topic in enumerate(lda.components_):
        top_keywords = [
            {"word": terms[i], "weight": round(topic[i], 4)}
            for i in topic.argsort()[-10:]
            if terms[i].strip()
        ]
        topics[f"Topic {idx+1}"] = top_keywords

    doc_topics = lda.transform(doc_term_matrix)

    for doc_idx, topic_probs in enumerate(doc_topics):
        top_topic = topic_probs.argmax()
        topic_distribution[top_topic] += 1
        if len(topic_samples[f"Topic {top_topic+1}"]) < 3:
            topic_samples[f"Topic {top_topic+1}"].append(texts.iloc[doc_idx])

    result = {
        "topics": topics,
        "distribution": topic_distribution,
        "samples": topic_samples
    }

    with open("backend/uploads/topic_output.json", "w") as f:
        json.dump(result, f)

    print(json.dumps(result), flush=True)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        log("Invalid arguments. Usage: python topic_modeling.py <csv_file_path> <num_topics>")
        raise SystemExit(1)

    topic_modeling(sys.argv[1], int(sys.argv[2]))
