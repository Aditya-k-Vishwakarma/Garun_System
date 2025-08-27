#!/usr/bin/env python3
"""Test script to verify the wards API endpoint"""

import requests
import json

def test_wards_api():
    """Test the wards API endpoint"""
    try:
        print("Testing wards API endpoint...")
        
        # Test the wards endpoint
        response = requests.get('http://localhost:8000/api/wards')
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response Data: {json.dumps(data, indent=2)}")
            
            if data.get('success') and data.get('wards'):
                print(f"✅ Success! Found {len(data['wards'])} wards")
                # Show first few wards
                for i, ward in enumerate(data['wards'][:5]):
                    print(f"  {i+1}. {ward['ward_name']} (Ward {ward['ward_number']})")
            else:
                print("❌ API returned success but no wards data")
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print(f"Response text: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Is the server running on port 8000?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_wards_api()
