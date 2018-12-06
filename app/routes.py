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
import dill as pickle
from restaurant_data import getHeatMapData

topCategories = ["Restaurants", "Shopping", "Food", "Beauty & Spas", "Home Services", "Health & Medical", "Local Services", "Automotive", "Nightlife", "Bars"]

username = ""

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
    return render_template('explore.html', title='Yelp Me Out!!', user=user, posts=posts)

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', title='Yelp Me Out!!')

@app.route('/metricTest')
def renderMetricTest():
    conn = sqlite3.connect('app.db')
    cur = conn.cursor()
    cur.execute("SELECT count(*) from user1")
    rows = cur.fetchall()
    print(rows)
    return render_template('metricTest.html', title='Yelp Me Out!!')

@app.route('/popularityCurve')
def renderpopularityCurve():
    return render_template('popularityCurve.html', title='Yelp Me Out!!')

@app.route('/getRatingData', methods=['GET'])
def getRatingData():
    # conn = sqlite3.connect('app.db')
    # cur = conn.cursor()

    # queryStr = "select * from (select AVG(stars), date from reviews where business_id='vHz2RLtfUMVRPFmd7VBEHA' and date>'2018-01-01' group by date order by date DESC limit 1) order by date limit 10;"
    # cur.execute(queryStr)
    # data = cur.fetchall()
    time.sleep(1)

    return send_from_directory('data', 'popularity.json')
    # return json.dumps(ratingData)

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
    return categories[:50]

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
        #   pass
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
    return json.dumps({'data': bow})

def getWeek(i):
    i = str(i)
    m = {"0": "Sun", "1": "Mon", "2": "Tues", "3": "Wed", "4": "Thur", "5": "Fri", "6": "Sat"}
    return m[i]

def reverseMap(day):
    m = {"Fri": 5, "Sun": 0, "Mon": 1, "Tue": 2, "Sat": 6, "Wed": 3, "Thu": 4}
    return m[day]

def getCheckins():
    data = {"Mon": [0]*24, "Tue": [0]*24, "Wed": [0]*24, "Thu": [0]*24, "Fri": [0]*24, "Sat": [0]*24, "Sun": [0]*24}
    conn = sqlite3.connect('app.db')
    cur = conn.cursor()
    cur.execute("select * from checkin where business_id ='4JNXUYY8wbaaDmk3BPzlWw'")
    row = cur.fetchone()
    checkinData = json.loads(row[0])
    for i in checkinData:
        temp = i.split("-")
        count = checkinData[i]
        data[temp[0]][(int(temp[1])-7)%24] = count
    print(data)
    return data

@app.route('/getCheckinData', methods=['GET'])
def getCheckinData():
    data = getCheckins()
    return json.dumps({"data": data})

@app.route('/getBusinessPopData', methods=['GET'])
def getBusinessPopData():
    data = getBusinessCategories()
    data = data[:10]
    bow = []
    for i in data:
        bow.append({'rating': i[0], 'count': i[1]})
    return json.dumps({'data': bow})

@app.route('/analyze')
def renderAnalyze():
    # data = getTagData()
    return render_template('analyze.html', title='Yelp Me Out!!')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # flash('Login requested for user {}, remember_me={}'.format(
        #     form.username.data, form.remember_me.data))
        username = form.username.data
        return redirect(url_for('index'))
    return render_template('login.html', title='Yelp Me Out!!', form=form)


def parseFeatures(features):
    ans = []
    for i in features:
        ans.append(i.encode('ascii', 'ignore'))
    return ans

@app.route('/getRating', methods=['POST'])
def get_rating():
    if not request.json:
        abort(400)
    with open('app/data/rating_model.pkl', 'rb') as file:
        get_rating = (pickle.load(file))
        features = parseFeatures(request.json['data'])
        print(features)
        rating = json.dumps({'result': round(get_rating(map(str.lower, 
            features)), 2)})
        print(rating)
        return rating

    return json.dumps({'result':2.5})


@app.route('/sentimentMetric')
def renderSentimentMetric():
    return render_template('sentimentNew.html', title='Yelp Me Out!!')


@app.route('/getSentimentData')
def getSentimentData():
    return send_from_directory('data', 'sentimentData.json')

@app.route('/heatMap')
def renderHeatmap():
    return render_template('heatmap.html', title='Heatmap')

@app.route('/getHeatmapData')
def getHeatmapData():
    businessType = (request.args.get('businessType'))
    print(businessType)
    data = getHeatMapData(businessType)
    return json.dumps(data)

@app.route('/getUSjson')
def getUSjson():
    return send_from_directory('data', 'us.json')


@app.route('/myProfile')
def myProfile():
    return render_template('myProfile.html', title='Yelp Me Out!!')

@app.route('/predict')
def renderPredict():
    return render_template('predict.html', title='Yelp Me Out!!')
