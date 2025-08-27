import pandas as pd
import requests
import json
from typing import Dict, List, Optional, Tuple
import os

class WardService:
    def __init__(self, excel_file_path: str = "Indore Data Collection 2025.xlsx"):
        self.excel_file_path = excel_file_path
        self.ward_data = {}
        self.coordinates_cache = {}
        self.load_ward_data()
    
    def load_ward_data(self):
        """Load ward data from Excel file"""
        try:
            if os.path.exists(self.excel_file_path):
                df = pd.read_excel(self.excel_file_path)
                for _, row in df.iterrows():
                    ward_name = row['Ward Name']
                    ward_number = int(row['Ward Number'])
                    households = int(row['Total no. of Households'])
                    
                    self.ward_data[ward_number] = {
                        'name': ward_name,
                        'number': ward_number,
                        'households': households,
                        'coordinates': None
                    }
                
                print(f"Loaded {len(self.ward_data)} wards from Excel file")
            else:
                print(f"Excel file not found: {self.excel_file_path}")
        except Exception as e:
            print(f"Error loading ward data: {e}")
    
    def get_all_wards(self) -> List[Dict]:
        """Get all wards with their data"""
        return [
            {
                'ward_number': ward_num,
                'ward_name': data['name'],
                'households': data['households'],
                'coordinates': data['coordinates']
            }
            for ward_num, data in self.ward_data.items()
        ]
    
    def get_ward_by_number(self, ward_number: int) -> Optional[Dict]:
        """Get ward data by ward number"""
        if ward_number in self.ward_data:
            data = self.ward_data[ward_number]
            return {
                'ward_number': data['number'],
                'ward_name': data['name'],
                'households': data['households'],
                'coordinates': data['coordinates']
            }
        return None
    
    def get_ward_by_name(self, ward_name: str) -> Optional[Dict]:
        """Get ward data by ward name"""
        for ward_num, data in self.ward_data.items():
            if data['name'].lower() == ward_name.lower():
                return {
                    'ward_number': data['number'],
                    'ward_name': data['name'],
                    'households': data['households'],
                    'coordinates': data['coordinates']
                }
        return None
    
    def fetch_coordinates_for_ward(self, ward_name: str, city: str = "Indore, Madhya Pradesh, India") -> Optional[Tuple[float, float]]:
        """Fetch coordinates for a ward using OpenStreetMap Nominatim API"""
        try:
            # Check cache first
            cache_key = f"{ward_name}_{city}"
            if cache_key in self.coordinates_cache:
                return self.coordinates_cache[cache_key]
            
            # Construct search query
            search_query = f"{ward_name}, {city}"
            
            # Use OpenStreetMap Nominatim API (free, no API key required)
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                'q': search_query,
                'format': 'json',
                'limit': 1,
                'countrycodes': 'in'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data and len(data) > 0:
                lat = float(data[0]['lat'])
                lon = float(data[0]['lon'])
                
                # Cache the result
                self.coordinates_cache[cache_key] = (lat, lon)
                
                # Update ward data
                for ward_num, ward_info in self.ward_data.items():
                    if ward_info['name'].lower() == ward_name.lower():
                        ward_info['coordinates'] = {'latitude': lat, 'longitude': lon}
                        break
                
                print(f"Fetched coordinates for {ward_name}: ({lat}, {lon})")
                return (lat, lon)
            else:
                print(f"No coordinates found for {ward_name}")
                return None
                
        except Exception as e:
            print(f"Error fetching coordinates for {ward_name}: {e}")
            return None
    
    def get_ward_coordinates(self, ward_name: str) -> Optional[Tuple[float, float]]:
        """Get coordinates for a ward, fetching if not available"""
        # First check if we already have coordinates
        for ward_num, ward_info in self.ward_data.items():
            if ward_info['name'].lower() == ward_name.lower():
                if ward_info['coordinates']:
                    return (ward_info['coordinates']['latitude'], ward_info['coordinates']['longitude'])
                else:
                    # Fetch coordinates
                    return self.fetch_coordinates_for_ward(ward_name)
        
        # If ward not found, try to fetch coordinates anyway
        return self.fetch_coordinates_for_ward(ward_name)
    
    def search_wards(self, query: str) -> List[Dict]:
        """Search wards by name or number"""
        query = query.lower()
        results = []
        
        for ward_num, data in self.ward_data.items():
            if (query in str(ward_num) or 
                query in data['name'].lower()):
                results.append({
                    'ward_number': data['number'],
                    'ward_name': data['name'],
                    'households': data['households'],
                    'coordinates': data['coordinates']
                })
        
        return results[:10]  # Limit to 10 results

# Global instance
ward_service = WardService()
