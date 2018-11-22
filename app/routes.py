from flask import *
from app import app
from app.forms import LoginForm
from app import db
from app.models import Business, Checkin, Reviews, Tip, User1
import sqlite3
import json
from collections import OrderedDict
import traffic
import analyze_tagRating
import time
import copy

topCategories = ["Restaurants", "Shopping", "Food", "Beauty & Spas", "Home Services", "Health & Medical", "Local Services", "Automotive", "Nightlife", "Bars"]

@app.route('/index')
def index():
    user = {'username': 'bowbow'}
    posts = [
        {
            'author': {'username': 'bowbow'},
            'body': 'Dog Says bowbow'
        },
        {
            'author': {'username': 'bowbow'},
            'body': 'Dog says bowbow!!'
        }
    ]
    return render_template('explore.html', title='Home', user=user, posts=posts)

@app.route('/metricTest')
def renderMetricTest():
    conn = sqlite3.connect('app.db')
    cur = conn.cursor()
    cur.execute("SELECT count(*) from user1")
    rows = cur.fetchall()
    print(rows)
    return render_template('metricTest.html', title='Test Metric')


@app.route('/getTestData', methods=['GET'])
def getTestData():
    queryStr = "SELECT SUM(CASE WHEN stars > 4 THEN 1 ELSE 0 END) AS \"(4,5]\", SUM(CASE WHEN stars BETWEEN 3.01 AND 4 THEN 1 ELSE 0 END) AS \"(3,4]\", SUM(CASE WHEN stars BETWEEN 2.01 AND 3 THEN 1 ELSE 0 END) AS \"(2,3]\", SUM(CASE WHEN stars BETWEEN 1.01 AND 2 THEN 1 ELSE 0 END) AS \"(1,2]\", SUM(CASE WHEN stars BETWEEN 0 AND 1 THEN 1 ELSE 0 END) AS \"[0,1]\" FROM business;"
    conn = sqlite3.connect('app.db')
    cur = conn.cursor()
    cur.execute(queryStr)
    data = cur.fetchone()
    ratingData = {'data':[
        {'rating': "4-5", 'count': data[0]},
        {'rating': "3-4", 'count': data[1]},
        {'rating': "2-3", 'count': data[2]},
        {'rating': "1-2", 'count': data[3]},
        {'rating': "0-1", 'count': data[4]}
    ]}
    return json.dumps(ratingData)

@app.route('/getCategories', methods=['GET'])
def getBusinessCategories():
	queryStr = "SELECT categories from business"
	conn = sqlite3.connect('app.db')
	cur = conn.cursor()
	cur.execute(queryStr)
	data = cur.fetchall()
	categories = {}

	for i in data:
		try:
			temp = i[0].split(", ")
			for j in temp:
				try:
					categories[j] += 1
				except:
					categories[j] = 1
		except:
			pass
	categories = sorted(categories.items(), key=lambda kv: kv[1], reverse=True)
	topCategories = map(lambda x: x[0], categories[:10])
	# Found top categories, get all businesses with these categories, get counts for a sample time range
	return json.dumps(categories[:50])

@app.route('/getTraffic', methods=['GET'])
def getTraffic():
	timeRange = (request.args.get('time'))
	bow = traffic.getTrafficData(timeRange)
	return json.dumps({'data': bow})


def range(rating):
	a = float(rating)
	if( a >= 4):
		return "4-5"
	elif(a >= 3 and a < 4):
		return "3-4"
	elif(a >= 2 and a < 3):
		return "2-3"
	elif(a >= 1 and a < 2):
		return "1-2"
	else:
		return "0-1"

def getTagData():
    conn = sqlite3.connect('app.db')
    cur = conn.cursor()
    cur.execute("SELECT attributes, stars from business where categories like 'Restaurants%'")
    rows = cur.fetchall()
    print(len(rows))
    data = copy.deepcopy(analyze_tagRating.data)
    for row in rows:
        temp = json.loads(row[0])
        # try:
        #     for i in temp:
        #         print i,temp[i]
        # except:
        # 	pass
        try:
			if(temp["Alcohol"] != "none"):
				data["Alcohol"][range(row[1])] += 1
        except:
			pass
        try:
			if(temp["WiFi"] != "no"):
				data["WiFi"][range(row[1])] += 1
        except:
			pass
        try:
			if(temp["HasTV"] == "True"):
				data["HasTV"][range(row[1])] += 1
        except:
			pass
        try:
			if(temp["GoodForKids"] == "True"):
				data["GoodForKids"][range(row[1])] += 1
        except:
			pass
        try:
			if(temp["RestaurantsReservation"] == "True"):
				data["Reservations"][range(row[1])] += 1
        except:
			pass
        try:
			if(temp["WheelchairAccessible"] == "True"):
				data["Wheelchair Accessible"][range(row[1])] += 1
        except:
			pass
        try:
			if(temp["Caters"] == "True"):
				data["Catering"][range(row[1])] += 1
        except:
			pass
    return data

@app.route('/getTagRating', methods=['GET'])
def getTagRating():
	data = getTagData()
	bow = []
	for i in data:
		total = 0
		temp = data[i]
		for j in temp:
			total += int(temp[j])
		temp["State"] = i
		temp["total"] = total
		bow.append(temp)
	print(bow)
	return json.dumps({'data': bow})

@app.route('/analyze')
def renderAnalyze():
	# data = getTagData()
	return render_template('analyze.html', title='Analyze')

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title='Sign In', form=form)


@app.route('/sentimentMetric')
def renderSentimentMetric():
    return render_template('sentimentMetric.html', title='Sentiment Metric')

@app.route('/getSentimentData')
def getSentimentData():
    return send_from_directory('data', 'sentimentData.json')
    
