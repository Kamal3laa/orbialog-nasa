"""
Sets up NASA Earthdata authentication using an authorization token.
Saves ~/.netrc and ~/.dodsrc for earthaccess, rasterio, and GDAL access.
"""

import os
import sys
import earthaccess

EARTHDATA_TOKEN = (
    "eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ."
    "eyJ0eXBlIjoiVXNlciIsInVpZCI6ImJlZG8zMjEyIiwic3ViIjoiYmVkbzMyMTIiLCJleHAiOjE3OTk4MDA1NTAsImlhdCI6MTc5NDYxNjU1MCwiaXNzIjoiaHR0cHM6Ly91cnMuZWFydGhkYXRhLm5hc2EuZ292IiwiaWRlbnRpdHlfcHJvdmlkZXIiOiJlZGxfb3BzIiwiYWNyIjoiZWRsIiwiYXNzdXJhbmNlX2xldmVsIjozfQ."
    "yMdjFOrdnD6ors_9WvyHAjzhgPtIULNYlVs6Us_qr0_vQNXa6fA-alBdARc0Wr3nkqxB4C-7I4bWicgpEoiwwlovU1P8SOyDw5uC0JecweDru1NgLXg48PUhHolchBFuA3UB_j_DNYgMYSpASWBS-VD_aab6tIvXcresTwM2QLOikvDUMdfjYpH-4GhkSDapK295JRukmOngaPuWqVroOcEy4-iuWRQ3Z2oDcNWKxaYYFl3QOOW_oKrYf_flnUTSMQQN8UJvuZNqOzio1YFv3Eo9SahziQmtZi_SAjT5yBhUGmaXankCRgu82NzcCNYIL0-0DnGwLo0rqLf-dU8kGg"
)


def login_with_token(token: str):
    print("Authenticating with NASA Earthdata via bearer token...")
    os.environ["EARTHDATA_TOKEN"] = token
    auth = earthaccess.login(strategy="environment", persist=True)
    if auth.authenticated:
        print("Successfully authenticated to NASA Earthdata Cloud!")
        return auth
    else:
        print("Authentication failed.")
        sys.exit(1)


if __name__ == "__main__":
    token = sys.argv[1] if len(sys.argv) > 1 else EARTHDATA_TOKEN
    login_with_token(token)
