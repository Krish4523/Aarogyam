# import os
# import requests
# from bs4 import BeautifulSoup
# import re
#
# # Base URL for the Charaka Samhita
# base_url = "https://www.wisdomlib.org"
#
# # Starting URL
# start_url = f"{base_url}/hinduism/book/charaka-samhita-english/d/doc627511.html"
#
# # Directory to save files
# save_dir = "../data/charaka-samhita"
#
# # Create directory if it does not exist
# os.makedirs(save_dir, exist_ok=True)
#
#
# def scrape_page(url):
#     """
#     Scrapes a single page of the Charaka Samhita and saves the content to a file.
#
#     Args:
#         url (str): The URL of the page to scrape.
#
#     Returns:
#         str or None: The URL of the next page to scrape, or None if there is no next page.
#     """
#     try:
#         response = requests.get(url)
#         response.raise_for_status()  # Raise HTTPError for bad responses
#     except requests.RequestException as e:
#         print(f"Error fetching {url}: {e}")
#         return None
#
#     soup = BeautifulSoup(response.content, 'html.parser')
#
#     # Extract the heading
#     heading = soup.find('h1', class_='h2 pt-2')
#     if heading:
#         heading = heading.text.strip()
#     else:
#         print("Heading not found.")
#         return None
#
#     # Extract the actual data
#     content_div = soup.find('div', class_='col-12 mt-3 mb-5 chapter-content text_1686')
#     if not content_div:
#         print("Content div not found.")
#         return None
#
#     content = []
#     for tag in content_div.find_all(['p', 'h2']):
#         # Convert headings to Markdown headers
#         if tag.name == 'h2':
#             content.append(f"## {tag.get_text(strip=True)}")
#         else:
#             # Remove any additional formatting issues
#             content.append(re.sub(r'^\d+[\.\-\)\(\:\;\,\!\?\s\u00B9\u00B2\u00B3\u00BC\u00BD\u00BE]*', '',
#                                   re.sub(r'^\d+[\.\-\)\(\:\;\,\!\?\s]*', '', tag.get_text(strip=True))))
#
#     # Join the content to preserve formatting
#     joined_content = "\n\n".join(content)
#
#     # Create a file name from the heading
#     file_name = heading.replace(' ', '_').replace('-', '_').lower() + '.md'
#
#     try:
#         parent_text_tag = soup.find('nav', class_='col col-sm px-2 text-center order-2 order-sm-2').find('span')
#         parent_text = parent_text_tag.get_text(strip=True) if parent_text_tag else ''
#     except:
#         parent_text = ''
#
#     # Create full path for the file
#     dir_save = os.path.join(save_dir, parent_text)
#
#     os.makedirs(dir_save, exist_ok=True)
#     file_path = os.path.join(dir_save, file_name)
#     # Save the content to a file
#     with open(file_path, 'w', encoding='utf-8') as file:
#         file.write(f"# {heading}\n\n{joined_content}")
#
#     print(f"Saved: {file_name}")
#
#     # Find the next page URL
#     next_link = soup.find('div', class_='col-auto col-sm-auto order-3 order-sm-3').find('a')
#     if next_link:
#         next_url = base_url + next_link['href']
#         return next_url
#     return None
#
#
# def scrape_charaka_samhita(url):
#     """
#     Scrapes the Charaka Samhita starting from the given URL and follows pagination.
#
#     Args:
#         url (str): The starting URL of the Charaka Samhita.
#     """
#     while url:
#         url = scrape_page(url)
#         # Uncomment below if you want to stop after the first page for testing
#         # break
#
#
# # Start scraping
# if __name__ == "__main__":
#     scrape_charaka_samhita(start_url)
#
# # if __name__ == "__main__":
# #     base_url = "https://www.wisdomlib.org"
# #     start_url = f"{base_url}/hinduism/book/charaka-samhita-english/d/doc627511.html"
# #     save_dir = "../data/charaka-samhita"
# #
# #     scraper = WisdomLibScraper(base_url, start_url, save_dir)
# #     scraper.scrape()

from wisdomlib_scraper import WisdomLibScraper

if __name__ == "__main__":
    start_url = "/hinduism/book/charaka-samhita-english/d/doc627511.html"

    save_dir = "../data/charaka-samhita"

    scraper = WisdomLibScraper(start_url, save_dir)
    scraper.scrape()