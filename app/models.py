from datetime import datetime
from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    posts = db.relationship('Post', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post {}>'.format(self.body)


class Business(db.Model):
    business_id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(140))
    neighborhood = db.Column(db.String(280))
    address = db.Column(db.String(280))
    city = db.Column(db.String(40))
    state = db.Column(db.String(40))
    postal_code = db.Column(db.String(30))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    stars = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    is_open = db.Column(db.Integer)
    attributes = db.Column(db.String(500))
    categories = db.Column(db.String(100))
    hours = db.Column(db.String(300))

    def __repr__(self):
        return '<Business {}>'.format(self.business_id)


class Checkin(db.Model):
	time = db.Column(db.String(300))
	business_id = db.Column(db.String(100), primary_key=True)

	def __repr__(self):
		return '<Checkin {}>'.format(self.time)


class Reviews(db.Model):
	review_id = db.Column(db.String(100), primary_key=True)
	user_id = db.Column(db.String(100))
	business_id = db.Column(db.String(100))
	stars = db.Column(db.Float)
	date = db.Column(db.String(50))
	text = db.Column(db.Text)
	useful = db.Column(db.Integer)
	funny = db.Column(db.Integer)
	cool = db.Column(db.Integer)

	def __repr__(self):
		return '<Reviews {}>'.format(self.text)

class Tip(db.Model):
	tip_id = db.Column(db.String(20), primary_key=True)
	text = db.Column(db.Text)
	date = db.Column(db.String(50))
	likes = db.Column(db.Integer)
	business_id = db.Column(db.String(100))
	user_id = db.Column(db.String(100))

	def __repr__(self):
		return '<Tip {}>'.format(self.text)

class User1(db.Model):
	user_id = db.Column(db.String(100), primary_key=True)
	name = db.Column(db.String(50))
	review_count = db.Column(db.Integer)
	yelping_since = db.Column(db.String(50))
	friends = db.Column(db.String(100))
	useful = db.Column(db.Integer)
	funny = db.Column(db.Integer)
	cool = db.Column(db.Integer)
	fans = db.Column(db.Integer)
	elite = db.Column(db.String(100))
	average_stars = db.Column(db.Float)
	compliment_hot = db.Column(db.Integer)
	compliment_more = db.Column(db.Integer)
	compliment_profile = db.Column(db.Integer)
	compliment_cute = db.Column(db.Integer)
	compliment_list = db.Column(db.Integer)
	compliment_note = db.Column(db.Integer)
	compliment_plain = db.Column(db.Integer)
	compliment_cool = db.Column(db.Integer)
	compliment_funny = db.Column(db.Integer)
	compliment_writer = db.Column(db.Integer)
	compliment_photos = db.Column(db.Integer)

	def __repr__(self):
		return '<User1 {}>'.format(self.user_id)