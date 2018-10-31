import sqlite3
import json
from flask import render_template, flash, redirect, url_for
from app import app
from app import db
from app.models import Business

def createQuery(row):
	business_id = row.get("business_id")
	name = row.get("name")
	neighborhood = row.get("neighborhood")
	address = row.get("address")
	city = row.get("city")
	state = row.get("state")
	postal_code = row.get("postal_code")
	latitude = row.get("latitude")
	longitude = row.get("longitude")
	stars = row.get("stars")
	is_open = row.get("is_open")
	review_count = row.get("review_count")
	attributes = json.dumps(row.get("attributes"))
	categories = row.get("categories")
	hours = json.dumps(row.get("hours"))
	# queryStr = "INSERT INTO business (business_id, name, neighborhood, address, city, state, postal_code, latitude, longitude, stars, review_count, is_open, attributes, categories, hours) VALUES ('%s', '%s', '%s', '%s', '%s', '%s','%s', %s, %s, %s, %s, %s, '%s', '%s', '%s')" %(business_id, name, neighborhood, address, city, state, postal_code, latitude, longitude, stars, review_count, is_open, attributes, categories, hours)
	obj = Business(business_id=business_id, name=name, neighborhood=neighborhood, address=address, 
		city=city, state=state, postal_code=postal_code, latitude=latitude, longitude=longitude,
		stars=stars, is_open=is_open, review_count=review_count, attributes=attributes,
		categories=categories, hours=hours)
	print(obj)


conn = sqlite3.connect('../app.db')
c = conn.cursor()
data = open("../yelp_academic_dataset_business.json", "r").readlines()
for row in data[1:100]:
	createQuery(json.loads(row))
print(len(data))
print c