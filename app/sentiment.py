# https://markhneedham.com/blog/2015/02/15/pythonscikit-learn-calculating-tfidf-on-how-i-met-your-mother-transcripts/
# paper : https://arxiv.org/pdf/1709.08698.pdf

import sqlite3
import json
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem.porter import PorterStemmer
from autocorrect import spell
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer

def removeNonAlpha(reviews):
	nltk.download('punkt')
	index = 0
	for review in reviews:
		reviews[index] = re.sub('[^A-Za-z]', ' ', review).lower()
		index += 1
	return reviews

def tokenize(reviews):
	index = 0
	for review in reviews:
		reviews[index] = word_tokenize(review)
		index += 1
	return reviews

def removeStopWords(reviews):
	index = 0
	nltk.download('stopwords')
	for review in reviews: 
		for word in review:
		    if word in stopwords.words('english'):
		        review.remove(word)
		reviews[index] = review
		index += 1
	return reviews

def runSpellChecker(reviews):
	stemmer = PorterStemmer()
	index = 0
	for review in reviews:
		for i in range(len(review)):
			review[i] = stemmer.stem(spell(review[i]))
		reviews[index] = review
		index += 1
	return reviews

def getRootWords(reviews):
	stemmer = PorterStemmer()
	index = 0
	for review in reviews:
		for i in range(len(review)):
		    review[i] = stemmer.stem(review[i])
		reviews[index] = review
		index += 1
	return reviews

def rebuildReviews(reviews):
	index = 0
	for review in reviews:
		review = " ".join(review)
		reviews[index] = review
		index += 1
	return reviews

def fetchReviews(business_ids, flag):
	reviews = []
	conn = sqlite3.connect('../app.db')
	cur = conn.cursor()
	if flag:
		query = "SELECT * from reviews where stars > 4 and business_id in (" + business_ids + ")"
	else:
		query = "SELECT * from reviews where stars < 2 and business_id in (" + business_ids + ")"
	cur.execute(query)
	rows = cur.fetchall()
	for row in rows:
		reviews.append(row[5])
	return reviews

def getRestaurantBusinessIDs(cuisine):
	ids = []
	conn = sqlite3.connect('../app.db')
	cur = conn.cursor()
	cur.execute("select business_id from business where categories like \'%Restaurants%\' and categories like \'%"+ cuisine + "%\' limit 100")
	ids = cur.fetchall()
	return ids

# flag = true for positive words, false for negative words
def getTopWords(business_ids, flag):
	reviews = fetchReviews(business_ids, flag)
	print "fetched " + str(len(reviews)) + " reviews"
	reviews = removeNonAlpha(reviews)
	print "removed non alphabetical letters"
	reviews = tokenize(reviews)
	print "tokenized reviews"
	reviews = removeStopWords(reviews)
	print "removed stop words"
	reviews = getRootWords(reviews)
	print "extracted root words"
	# reviews = runSpellChecker(reviews)
	# print "ran the spell checker"
	reviews = rebuildReviews(reviews)
	print "rebuilt reviews"

	# Get the tfidf scores
	tf = TfidfVectorizer(analyzer='word', ngram_range=(2,2), min_df = 0, stop_words = 'english')
	tfidf_matrix =  tf.fit_transform(reviews)
	feature_names = tf.get_feature_names() 
	tfidf_scores = tfidf_matrix.todense()
	print "got the tdidf scores"

	# Sum up all the scores across reviews
	cum_tfidf_scores = tfidf_scores.sum(axis=0)
	episode = cum_tfidf_scores[0].tolist()[0]
	phrase_scores = [pair for pair in zip(range(0, len(episode)), episode)]
	print "summation across reviews done"

	# Sort descending on scores
	sorted_cum_tfidf_scores = sorted(phrase_scores, key=lambda t: t[1] * -1)
	print "sorted in descending order"

	result = []
	# Pick top n
	for item in sorted_cum_tfidf_scores[:50]:
		result.append((feature_names[item[0]], item[1]))
	print "Returning result length :" + str(len(result))  
	return result
	
if __name__ == '__main__':
	cuisines = ["French"]
	data = {
		"data" : []
	}
	for cuisine in cuisines:
		ids = getRestaurantBusinessIDs(cuisine)
		idstr = ""
		for id in ids:
			idstr += '\'' + id[0] + '\'' + ","
		id_query = idstr[:-1]
		cuisine_dict = {
			cuisine : {}
		}
		cuisine_dict[cuisine]["positive"] = getTopWords(id_query, True)
		cuisine_dict[cuisine]["negative"] = getTopWords(id_query, False)
		data["data"].append(cuisine_dict)

	print json.dumps(data)
