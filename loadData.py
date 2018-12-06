import json
from flask import render_template, flash, redirect, url_for
from app import app
from app import db
from app.models import Business, Checkin, Reviews, Tip, User1


class DatabaseLoader:
	def __init__(self):
		self._business = "./yelp_academic_dataset_business.json"
		self._checkin = "./yelp_academic_dataset_checkin.json"
		self._reviews = "./yelp_academic_dataset_review.json"
		self._tip = "./yelp_academic_dataset_tip.json"
		self._user = "./yelp_academic_dataset_user.json"

	def _insertBusinessRow(self, row):
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
		db.session.add(obj)

	def loadBusinessData(self):
		data = open(self._business, "r").readlines()
		for row in data:
			self._insertBusinessRow(json.loads(row))
		db.session.commit()
		print("Business: Finished inserting %s records" %(str(len(data))))

	def _insertCheckinRow(self, row):
		business_id = row.get("business_id")
		time = json.dumps(row.get("time"))
		obj = Checkin(business_id=business_id, time=time)
		db.session.add(obj)

	def loadCheckinData(self):
		data = open(self._checkin, "r").readlines()
		for row in data:
			self._insertCheckinRow(json.loads(row))
		db.session.commit()
		print("Checkin: Finished inserting %s records" %(str(len(data))))

	def _insertReviewsRow(self, row):
		review_id = row.get("review_id")
		user_id = row.get("user_id")
		business_id = row.get("business_id")
		stars = row.get("stars")
		date = row.get("date")
		text = row.get("text")
		useful = row.get("useful")
		funny = row.get("funny")
		cool = row.get("cool")
		obj = Reviews(review_id=review_id, user_id=user_id, business_id=business_id, stars=stars,
			date=date, text=text, useful=useful, funny=funny, cool=cool)
		db.session.add(obj)

	def loadReviewsData(self):
		data = open(self._reviews, "r").readlines()
		counter = 0
		for row in data:
			counter = counter + 1
			self._insertReviewsRow(json.loads(row))
			if(counter % 100000 == 0):
				print("Done with %s rows of Reviews Data" %(str(counter)))
			if(counter % 1000000 == 0):
				print("Committed %s rows of Reviews Data" %(str(counter)))
				db.session.commit()
		db.session.commit()
		print("Reviews: Finished inserting %s records" %(str(len(data))))

	def _insertTipRow(self, row, tip_id):
		text = row.get("text")
		date = row.get("date")
		likes = row.get("likes")
		business_id = row.get("business_id")
		user_id = row.get("user_id")
		obj = Tip(tip_id=tip_id ,text=text, date=date, likes=likes, business_id=business_id, user_id=user_id)
		db.session.add(obj)

	def loadTipData(self):
		data = open(self._tip, "r").readlines()
		tip_id = 0
		for row in data:
			tip_id = tip_id + 1
			self._insertTipRow(json.loads(row), str(tip_id))
		db.session.commit()
		print("Tip: Finished inserting %s records" %(str(len(data))))


	def _insertUserRow(self, row):
		user_id = row.get("user_id")
		name = row.get("name")
		review_count = row.get("review_count")
		yelping_since = row.get("yelping_since")
		friends = row.get("friends")
		useful = row.get("useful")
		funny = row.get("funny")
		cool = row.get("cool")
		fans = row.get("fans")
		elite = row.get("elite")
		average_stars = row.get("average_stars")
		compliment_hot = row.get("compliment_hot")
		compliment_more = row.get("compliment_more")
		compliment_profile = row.get("compliment_profile")
		compliment_cute = row.get("compliment_cute")
		compliment_list = row.get("compliment_list")
		compliment_note = row.get("compliment_note")
		compliment_plain = row.get("compliment_plain")
		compliment_cool = row.get("compliment_cool")
		compliment_funny = row.get("compliment_funny")
		compliment_writer = row.get("compliment_writer")
		compliment_photos = row.get("compliment_photos")
		obj = User1(user_id=user_id, name=name, review_count=review_count, yelping_since=yelping_since,
			friends=friends, useful=useful, funny=funny, cool=cool, fans=fans, elite=elite,
			average_stars=average_stars, compliment_hot=compliment_hot, compliment_more=compliment_more,
			compliment_profile=compliment_profile, compliment_cute=compliment_cute, compliment_list=compliment_list,
			compliment_note=compliment_note, compliment_plain=compliment_plain, compliment_cool=compliment_cool,
			compliment_funny=compliment_funny, compliment_writer=compliment_writer, compliment_photos=compliment_photos)
		db.session.add(obj)

	def loadUserData(self):
		data = open(self._user, "r").readlines()
		counter = 0
		for row in data:
			counter = counter + 1
			self._insertUserRow(json.loads(row))
			if(counter % 100000 == 0):
				print("Done with %s rows of User Data" %(str(counter)))
			if(counter % 1000000 == 0):
				db.session.commit()
				print("Committed %s rows of User Data" %(str(counter)))
		db.session.commit()
		print("User: Finished inserting %s records" %(str(len(data))))



databaseLoader = DatabaseLoader()
#Each of the loadXXX() functions is used to load up one table of data. For instance loadCheckinData() loads up data related to checkins from the Yelp Dataset. I suggest you run one subroutine at a time to make sure the data has been dumped properly. 
#databaseLoader.loadCheckinData()
# databaseLoader.loadReviewsData()
# databaseLoader.loadTipData()
databaseLoader.loadUserData()
