import{j as i}from"./index-C1F3vddT.js";/* empty css               */const n=()=>i.jsxs("div",{className:"theory-container",children:[i.jsx("h1",{className:"theory-title",children:"Topic Modeling"}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"What is Topic Modeling?"}),i.jsx("p",{children:"Topic Modeling is an unsupervised learning technique used in Natural Language Processing (NLP) to automatically identify topics present in a collection of documents. It helps to organize, understand, and summarize large volumes of textual data by clustering words that frequently occur together."})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Latent Dirichlet Allocation (LDA)"}),i.jsx("p",{children:"LDA is one of the most popular topic modeling algorithms. It assumes:"}),i.jsxs("ul",{className:"list-disc",children:[i.jsx("li",{children:"Each document is a mixture of various topics."}),i.jsx("li",{children:"Each topic is a mixture of words with associated probabilities."})]})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Mathematical Representation"}),i.jsx("p",{children:"LDA models topic-word distributions probabilistically:"}),i.jsxs("dl",{children:[i.jsx("dt",{children:"P(w ∣ z) = (n(w,z) + β) / (n(z) + Vβ)"}),i.jsx("dd",{children:"Where:"}),i.jsxs("dd",{children:[i.jsx("strong",{children:"w"}),": word"]}),i.jsxs("dd",{children:[i.jsx("strong",{children:"z"}),": topic"]}),i.jsxs("dd",{children:[i.jsx("strong",{children:"n(w,z)"}),": frequency of word w in topic z"]}),i.jsxs("dd",{children:[i.jsx("strong",{children:"V"}),": vocabulary size"]}),i.jsxs("dd",{children:[i.jsx("strong",{children:"β"}),": smoothing parameter"]})]})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Procedure"}),i.jsxs("ol",{className:"list-decimal",children:[i.jsx("li",{className:"procedure-step",children:"Collect textual data (tweets, reviews, comments, etc.)."}),i.jsxs("li",{className:"procedure-step",children:["Preprocess data:",i.jsxs("ul",{className:"list-disc",children:[i.jsx("li",{children:"Lowercasing"}),i.jsx("li",{children:"Stopword removal"}),i.jsx("li",{children:"Tokenization"}),i.jsx("li",{children:"Optional: Lemmatization"})]})]}),i.jsx("li",{className:"procedure-step",children:"Create a dictionary and convert the data into a Bag-of-Words format."}),i.jsx("li",{className:"procedure-step",children:"Apply LDA model (e.g., using Gensim or scikit-learn)."}),i.jsx("li",{className:"procedure-step",children:"Visualize topics and interpret results."})]})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Code Example (Gensim + LDA)"}),i.jsx("pre",{children:`import gensim
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
    print(f"Topic {idx + 1}: {topic}")`})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Sample Output"}),i.jsx("pre",{children:`Topic 1: 0.150*"data" + 0.140*"books" + 0.130*"science"
Topic 2: 0.180*"machine" + 0.160*"learning" + 0.150*"ai"`})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Advantages"}),i.jsxs("ul",{className:"list-disc",children:[i.jsx("li",{children:"Discovers hidden topics in large text collections."}),i.jsx("li",{children:"Improves summarization and content recommendation."}),i.jsx("li",{children:"Useful for clustering and dimensionality reduction."})]})]}),i.jsxs("div",{className:"section",children:[i.jsx("h2",{children:"Limitations"}),i.jsxs("ul",{className:"list-disc",children:[i.jsx("li",{children:"Requires pre-defined number of topics."}),i.jsx("li",{children:"Highly sensitive to preprocessing quality."}),i.jsx("li",{children:"Topics may not always be interpretable."})]})]}),i.jsx("div",{className:"section final-thoughts",children:i.jsx("p",{children:"🔍 Topic modeling is a powerful way to extract meaning from unstructured text and is widely used in analyzing social media content, reviews, and articles. When paired with strong preprocessing and visualization tools, it can significantly boost insight generation in data analysis workflows."})})]});export{n as default};
