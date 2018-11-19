from flask import render_template, flash, redirect, url_for
from app import app
from app.forms import LoginForm
from app import db
from app.models import Business, Checkin, Reviews, Tip, User1
import sqlite3
import json

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
    return render_template('index.html', title='Home', user=user, posts=posts)

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

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title='Sign In', form=form)
