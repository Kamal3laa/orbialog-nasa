#!/usr/bin/env python3
"""
Canadian Space Agency (CSA) RADARSAT & RCM Metadata Fetcher
ORBiALOG Planetary Analog Platform - Space Apps Challenge

Uses Python's `requests` library to query the official CSA Open Data Portal
(https://donnees-data.asc-csa.gc.ca/) CKAN API. Fetches metadata for RADARSAT-1
and RADARSAT Constellation Mission (RCM) scenes and outputs formatted JSON.
"""

import sys
import json
import argparse
from typing import Dict, Any, List

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    import urllib.request
    import urllib.parse

CSA_BASE_URL = "https://donnees-data.asc-csa.gc.ca/api/3/action"
HEADERS = {
    "User-Agent": "ORBiALOG-Aerospace/1.0 (CSA-RADARSAT-Metadata-Fetcher)",
    "Accept": "application/json",
}

def search_radarsat_packages(query: str = "radarsat", rows: int = 5) -> List[Dict[str, Any]]:
    """Query the CSA CKAN package_search endpoint."""
    endpoint = f"{CSA_BASE_URL}/package_search"
    params = {
        "q": query,
        "rows": rows,
    }
    
    print(f"[*] Querying CSA CKAN endpoint: {endpoint}?q={query}&rows={rows} ...")
    try:
        if HAS_REQUESTS:
            response = requests.get(endpoint, params=params, headers=HEADERS, timeout=12)
            response.raise_for_status()
            data = response.json()
        else:
            query_str = urllib.parse.urlencode(params)
            req = urllib.request.Request(f"{endpoint}?{query_str}", headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        
        if not data.get("success"):
            print(f"[!] CSA Portal returned success=False", file=sys.stderr)
            return []
            
        results = data.get("result", {}).get("results", [])
        print(f"[+] Successfully retrieved {len(results)} datasets from CSA portal.")
        return results
    except Exception as e:
        print(f"[!] Error contacting CSA Open Data Portal: {e}", file=sys.stderr)
        return []

def get_package_details(package_id: str) -> Dict[str, Any]:
    """Fetch complete metadata for a specific dataset or scene package."""
    endpoint = f"{CSA_BASE_URL}/package_show"
    params = {"id": package_id}
    
    try:
        if HAS_REQUESTS:
            response = requests.get(endpoint, params=params, headers=HEADERS, timeout=12)
            response.raise_for_status()
            data = response.json()
        else:
            query_str = urllib.parse.urlencode(params)
            req = urllib.request.Request(f"{endpoint}?{query_str}", headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        return data.get("result", {})
    except Exception as e:
        print(f"[!] Error fetching package {package_id}: {e}", file=sys.stderr)
        return {}

def format_scene_summary(pkg: Dict[str, Any]) -> Dict[str, Any]:
    """Format package into clean ORBiALOG-compatible SAR metadata."""
    resources = []
    for r in pkg.get("resources", []):
        resources.append({
            "id": r.get("id"),
            "name": r.get("name"),
            "format": r.get("format"),
            "url": r.get("url"),
            "description": r.get("description"),
            "size": r.get("size"),
        })
        
    return {
        "id": pkg.get("id"),
        "title": pkg.get("title"),
        "name": pkg.get("name"),
        "notes": pkg.get("notes"),
        "metadata_created": pkg.get("metadata_created"),
        "metadata_modified": pkg.get("metadata_modified"),
        "organization": pkg.get("organization", {}).get("title"),
        "tags": [t.get("name") for t in pkg.get("tags", [])],
        "resources_count": len(resources),
        "resources": resources,
    }

def main():
    parser = argparse.ArgumentParser(description="Fetch RADARSAT/RCM metadata from CSA Open Data Portal")
    parser.add_argument("--query", "-q", default="radarsat", help="Search query (e.g., radarsat, rcm, sar)")
    parser.add_argument("--rows", "-r", type=int, default=5, help="Number of records to fetch")
    parser.add_argument("--output", "-o", help="Optional output JSON file path")
    args = parser.parse_args()

    results = search_radarsat_packages(query=args.query, rows=args.rows)
    formatted = [format_scene_summary(p) for p in results]

    output_json = json.dumps({
        "success": True,
        "source": "https://donnees-data.asc-csa.gc.ca/",
        "query": args.query,
        "count": len(formatted),
        "results": formatted,
    }, indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_json)
        print(f"[+] Output written to {args.output}")
    else:
        print(output_json)

if __name__ == "__main__":
    main()
