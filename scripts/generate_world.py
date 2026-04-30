import json, random, os
import numpy as np
from datetime import datetime, timedelta
from faker import Faker

random.seed(42)
np.random.seed(42)
fake = Faker()
Faker.seed(42)

arrival = datetime(2025, 8, 12)
today = datetime(2026, 4, 29)
days_in_us = (today - arrival).days

transactions = []

def add_tx(date, amount, category, merchant):
    transactions.append({
        "id": fake.uuid4()[:8],
        "date": date.strftime("%Y-%m-%d"),
        "amount": round(amount, 2),
        "category": category,
        "merchant": merchant
    })

current = datetime(2026, 1, 29)
end = today

while current <= end:
    m, d = current.month, current.day
    if d == 1: add_tx(current, 850, "Rent", "ASU Vista del Sol")
    if d == 5: add_tx(current, 35, "Phone", "Verizon Wireless")
    if d == 8:
        add_tx(current, 11, "Subscription", "Spotify")
        add_tx(current, 15, "Subscription", "Netflix")
        add_tx(current, 20, "Subscription", "ChatGPT Plus")
    if d == 10: add_tx(current, 35, "Transport", "Valley Metro Rail")
    if random.random() < 0.35:
        add_tx(current, round(random.uniform(28,75),2), "Groceries",
               random.choice(["Patel Brothers Tempe","Trader Joe's","Walmart Neighborhood Market","Fry's Food Store"]))
    if random.random() < 0.45:
        add_tx(current, round(random.uniform(8,38),2), "Dining",
               random.choice(["Chipotle Mexican Grill","Curry Corner Tempe","Saffron Indian Kitchen","Dutch Bros Coffee","Starbucks","Halal Guys"]))
    if random.random() < 0.28:
        add_tx(current, round(random.uniform(15,85),2), "Shopping", "Amazon")
    if random.random() < 0.12:
        add_tx(current, round(random.uniform(7,22),2), "Transport", "Uber")
    current += timedelta(days=1)

transactions.sort(key=lambda x: x["date"])

credit_series = []
score = 680.0
d = datetime(2026, 1, 29)
while d <= today:
    score += random.uniform(2,5) + random.gauss(0,1.5)
    score = min(score, 720)
    credit_series.append({"date": d.strftime("%Y-%m-%d"), "score": int(score)})
    d += timedelta(weeks=1)

countries = ["India"]*28 + ["China"]*10 + ["Brazil"]*5 + ["Mexico"]*2 + ["Nigeria"]*1 + ["South Korea"]*1
random.shuffle(countries)

members = []
for i in range(47):
    members.append({
        "id": f"m{i+1:03d}",
        "initials": fake.lexify("??").upper(),
        "country": countries[i],
        "avg_monthly_spend": round(float(np.random.normal(1200,280)),2),
        "savings_rate": round(float(np.clip(np.random.beta(2,8)*35,0,30)),1),
        "credit_utilization": round(float(np.clip(np.random.normal(35,17),5,88)),1),
        "on_time_payments_pct": round(float(np.clip(np.random.normal(94,5),70,100)),1),
        "current_credit_score": int(np.clip(np.random.normal(692,44),580,790))
    })

yash_util, yash_savings, yash_on_time, yash_score = 24.0, 8.5, 98.0, 718

def pct(value, arr, higher_is_better=True):
    below = sum(1 for x in arr if (x < value if higher_is_better else x > value))
    return round((below/len(arr))*100)

percentiles = {
    "creditUtil":     pct(yash_util,    [m["credit_utilization"]   for m in members], False),
    "savingsRate":    pct(yash_savings, [m["savings_rate"]         for m in members], True),
    "onTimePayments": pct(yash_on_time, [m["on_time_payments_pct"] for m in members], True),
    "creditScore":    pct(yash_score,   [m["current_credit_score"] for m in members], True),
}

world = {
    "generatedAt": today.isoformat(),
    "user": {
        "id": "yash-001", "name": "Yashwardhan", "initials": "Y",
        "country": "India", "school": "Arizona State University",
        "program": "M.S. Technology Management", "visa": "F-1",
        "arrivalDate": "2025-08-12", "daysInUS": days_in_us,
        "stage": "Internship Prep", "stageNumber": 3, "totalStages": 5,
        "stageProgress": 0.65, "nextStage": "First Job", "nextStageEta": "Aug 2026",
        "creditScore": 718, "creditScoreStart": 680,
        "creditScoreSeries": credit_series,
        "creditLimit": 3500, "currentBalance": 840,
        "currentUtilization": yash_util,
        "savingsRate": yash_savings, "onTimePayments": yash_on_time
    },
    "transactions": transactions,
    "cohort": {
        "name": "ASU Intl Grads", "subtitle": "Class of '26", "size": 47,
        "countryBreakdown": {"India":"60%","China":"21%","Brazil":"11%","Other":"8%"},
        "members": members,
        "userPercentiles": percentiles,
        "activeChallenge": {
            "title": "Save $500 by Spring Break", "deadline": "2026-05-15",
            "joined": 12, "total": 47, "pooled": 3840, "goal": 6000,
            "userSaved": 180, "userGoal": 500
        }
    },
    "quests": {
        "totalXP": 730, "level": 3, "levelName": "Riser",
        "nextLevelAt": 1000, "nextLevelName": "Anchor",
        "active": [
            {"id":"q1","title":"Pay April statement by May 8","xp":50,"progress":0.0,"deadline":"2026-05-08","category":"payment"},
            {"id":"q2","title":"Keep utilization under 30% this week","xp":30,"progress":0.65,"deadline":"2026-05-03","category":"utilization"},
            {"id":"q3","title":"Read: How to request a credit limit increase","xp":20,"progress":0.0,"deadline":"2026-05-10","category":"education"}
        ],
        "completed": [
            {"id":"q4","title":"Stay under 40% utilization for 30 days","xp":100,"completedOn":"2026-03-15"},
            {"id":"q5","title":"Pay 6 statements on time","xp":150,"completedOn":"2026-04-01"}
        ],
        "badges": [
            {"id":"b1","name":"First Statement","emoji":"📄","earned":True},
            {"id":"b2","name":"Limit Master","emoji":"🏆","earned":True},
            {"id":"b3","name":"ASU Anchor","emoji":"⚓","earned":True},
            {"id":"b4","name":"Saver Bronze","emoji":"💰","earned":False},
            {"id":"b5","name":"Perfect Month","emoji":"⭐","earned":False},
            {"id":"b6","name":"Referral Star","emoji":"🌟","earned":False}
        ]
    }
}

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "world.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f:
    json.dump(world, f, indent=2)

print("✅ world.json generated!")
print(f"   Transactions  : {len(transactions)}")
print(f"   Cohort members: {len(members)}")
print(f"   Credit series : {len(credit_series)} weekly samples")
print(f"   Days in US    : {days_in_us}")
print(f"   Credit score  : 718")
print(f"   Percentiles   : {percentiles}")
