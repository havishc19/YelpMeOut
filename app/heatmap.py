import sqlite3
import json
import csv

def getBusinessDetails():
	businesses = []
	conn = sqlite3.connect('../app.db')
	cur = conn.cursor()
	query = "SELECT state, count(*) from business where categories like '%Restaurants%' group by state";
	cur.execute(query)
	rows = cur.fetchall()
	for row in rows:
		businesses.append((row[0], row[1]))
	return businesses

if __name__ == '__main__':
	code_to_id_map = {}
	data = {"data" : []}
	visited = {}
	with open('./data/state_name_to_id.tsv','rb') as tsvin:
	    tsvin = csv.reader(tsvin, delimiter='\t')
	    for row in tsvin:
	    	code_to_id_map[row[1]] = row[0]
    
	print code_to_id_map
	res = ""
	businesses = getBusinessDetails()
	for business in businesses:
		try:
			res += code_to_id_map[business[0]] + ", " + business[0] + ", " + str(business[1]) + "\n"
			rowdata = {
						"code" : code_to_id_map[business[0]],
						"count" : business[1],
						"state" : business[0] 
					}
			visited[business[0]] = 1
			data["data"].append(rowdata)
		except Exception as e:
			pass

	for key in code_to_id_map.keys():
		try:
			temp = visited[key]
		except Exception as e:
			rowdata = {
						"code" : code_to_id_map[key],
						"count" : -1,
						"state" : key 
					}
			visited[business[0]] = 1
			data["data"].append(rowdata)
	print json.dumps(data)
	