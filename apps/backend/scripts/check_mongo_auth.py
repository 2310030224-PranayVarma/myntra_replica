#!/usr/bin/env python3
import os
from datetime import datetime

from pymongo import MongoClient


def main() -> None:
    uri = os.getenv("MONGODB_URI")
    if not uri:
    raise SystemExit("MONGODB_URI is not set")

    client = MongoClient(uri)

    db_name = uri.split("?")[0].rstrip("/").split("/")[-1] or "myntra_replica"
    db = client[db_name]

    users = list(db.users.find({}, {"_id": 0}).sort("updatedAt", -1).limit(10))
    events = list(db.auth_events.find({}, {"_id": 0}).sort("at", -1).limit(20))

    print(f"Database: {db_name}")
    print(f"users count: {db.users.count_documents({})}")
    print(f"auth_events count: {db.auth_events.count_documents({})}")
    print("\nRecent users:")
    for user in users:
        updated_at = user.get("updatedAt")
        if isinstance(updated_at, datetime):
            user["updatedAt"] = updated_at.isoformat()
        print(user)

    print("\nRecent auth events:")
    for event in events:
        at = event.get("at")
        if isinstance(at, datetime):
            event["at"] = at.isoformat()
        print(event)


if __name__ == "__main__":
    main()
