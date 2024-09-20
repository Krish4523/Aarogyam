import os
import uuid

import requests
from bs4 import BeautifulSoup
import re


class WisdomLibScraper:
    def __init__(self, start_url, save_dir):
        """
        Initializes the WisdomLibScraper with the base URL, starting URL, and directory to save files.

        Args:
            start_url (str): The starting URL for scraping.
            save_dir (str): The directory where the scraped content will be saved.
        """
        self.base_url = "https://www.wisdomlib.org"
        self.start_url = f"{self.base_url}{start_url}"
        self.save_dir = save_dir
        os.makedirs(self.save_dir, exist_ok=True)

    def scrape_page(self, url):
        """
        Scrapes a single page and saves the content to a file.

        Args:
            url (str): The URL of the page to scrape.

        Returns:
            str or None: The URL of the next page to scrape, or None if there is no next page.
        """
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise HTTPError for bad responses
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract the heading
        heading = soup.find('h1', class_='h2 pt-2')
        if heading:
            heading = heading.text.strip()
        else:
            print("Heading not found.")
            heading = uuid.uuid4()

        # Extract the actual data
        # content_div = soup.find('div', class_='col-12 mt-3 mb-5 chapter-content')
        content_div = soup.find('div', id='scontent')

        if content_div:
            content = []
            for tag in content_div.find_all(['p', 'h2']):
                # Convert headings to Markdown headers
                if tag.name == 'h2':
                    content.append(f"## {tag.get_text(strip=True)}")
                else:
                    # Remove any additional formatting issues
                    content.append(re.sub(r'^\d+[\.\-\)\(\:\;\,\!\?\s\u00B9\u00B2\u00B3\u00BC\u00BD\u00BE]*', '',
                                          re.sub(r'^\d+[\.\-\)\(\:\;\,\!\?\s]*', '', tag.get_text(strip=True))))

            # Join the content to preserve formatting
            joined_content = "\n\n".join(content)
        else:
            print("Content div not found.")
            joined_content = ""

        # Create a file name from the heading
        file_name = heading.replace(' ', '_').replace('-', '_').replace('/', '_').lower() + '.md'

        try:
            parent_text_tag = soup.find('nav', class_='col col-sm px-2 text-center order-2 order-sm-2').find('span')
            parent_text = parent_text_tag.get_text(strip=True) if parent_text_tag else ''
        except:
            parent_text = ''

        # Create full path for the file
        dir_save = os.path.join(self.save_dir, parent_text)

        os.makedirs(dir_save, exist_ok=True)
        file_path = os.path.join(dir_save, file_name)
        # Save the content to a file
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(f"# {heading}\n\n{joined_content}")

        print(f"Saved: {file_name}")

        # Find the next page URL
        next_link = soup.find('div', class_='col-auto col-sm-auto order-3 order-sm-3').find('a')
        if next_link:
            next_url = self.base_url + next_link['href']
            return next_url
        return None

    def scrape(self):
        """
        Starts scraping from the initial URL and follows pagination.
        """
        url = self.start_url
        while url:
            url = self.scrape_page(url)
