from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import spacy
import pickle

# Load your dataset
data = pd.read_csv('models/chatbot/kidney.csv')  # Replace with your dataset file

# Load pre-trained spaCy English model
nlp = spacy.load("en_core_web_sm")

# Function to preprocess user query using spaCy
def preprocess_query(user_query):
    doc = nlp(user_query)
    tokens = [token.lemma_.lower() for token in doc if not token.is_stop and token.is_alpha]
    return " ".join(tokens)

# Preprocess all user queries in the dataset
data['Preprocessed_Query'] = data['User_Query'].apply(preprocess_query)

# Initialize and fit TF-IDF vectorizer
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(data['Preprocessed_Query'])

# Save TF-IDF vectorizer and TF-IDF matrix
with open('models/chatbot/tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

with open('models/chatbot/tfidf_matrix.pkl', 'wb') as f:
    pickle.dump(tfidf_matrix, f)

# Function to get the chatbot's response based on the preprocessed user query
def chatbot_response(user_query):
    preprocessed_query = preprocess_query(user_query)
    query_vector = vectorizer.transform([preprocessed_query])
    similarity_scores = cosine_similarity(query_vector, tfidf_matrix)
    best_match_index = similarity_scores.argmax()
    best_match_score = similarity_scores[0, best_match_index]

    if best_match_score > 0.5:  # Threshold for response relevance
        response = data.iloc[best_match_index]['Response']
    else:
        response = "Sorry, I couldn't find a relevant answer to your question."

    return response
