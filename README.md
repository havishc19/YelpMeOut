# DVA-YelpMeOut YelpMeOut

Step 1)
Create virtual environment
1.) virtualenv venv
2.) source venv/bin/activate


Step 2)
Install Flask & Dependencies to host python server
1.) pip install -r requirements.txt

Note:- Any of the future pip dependencies you install make sure to add them to requirements.txt by running "pip freeze > requirements.txt" AFTER you install the required dependency. 

The plan is to use Flask for the Controller Layer & HTML,CSS & JS with Jinja2 for UI, sqlite3 for Database needs.

Step 3)
Install sqlite3 for your OS

Step 4)
Creating DB schema

All the DB Schema is defined in models.py. Run the following steps to load it.
-> flask db init
-> flask db upgrade
-> flask db migrate -m "users table"
-> flask db upgrade
-> flask db migrate -m "business table"
-> flask db upgrade
-> flask db migrate -m "checkin table"
-> flask db upgrade
-> flask db migrate -m "reviews table"
-> flask db upgrade
-> flask db migrate -m "tip table"
-> flask db upgrade
-> flask db migrate -m "users1 table"
-> flask db upgrade

You show now be able to see database(app.db) created in your cwd. You can open an interactive session by running 'sqlite3 app.db'.

Run ".tables" to list all tables in DB. "alembic_version" maintains the commit history of your database, don't mess with it. 


Step 5) 
Dumping Yelp data into DB
-> Move all the Yelp files into the project root (in parallel with this README file)
-> Load each table by itself, the data's huge and all of it will prolly not fit in memory. So call the loadXXX() functions of DatabaseLoader Class in the loadData.py seperately.
-> This might take time.

Step 6)
Running the Flask Application
-> run 'flask run'