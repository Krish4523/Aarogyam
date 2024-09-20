from wisdomlib_scraper import WisdomLibScraper

if __name__ == "__main__":
    # Sushruta Samhita, volume 1: Sutrasthana
    WisdomLibScraper("/hinduism/book/sushruta-samhita-volume-1-sutrasthana/d/doc122878.html",
                     "../data/sushruta-samhita/volume-1-sutrasthana").scrape()

    # Sushruta Samhita, volume 2: Nidanasthana
    WisdomLibScraper("/hinduism/book/sushruta-samhita-volume-2-nidanasthana/d/doc142852.html",
                     "../data/sushruta-samhita/volume-2-nidanasthana").scrape()

    # Sushruta Samhita, volume 3: Sharirasthana
    WisdomLibScraper("/hinduism/book/sushruta-samhita-volume-3-sharirasthana/d/doc142875.html",
                     "../data/sushruta-samhita/volume-3-sharirasthana").scrape()

    # Sushruta Samhita, volume 4: Chikitsasthana
    WisdomLibScraper("/hinduism/book/sushruta-samhita-volume-4-cikitsasthana/d/doc142892.html",
                     "../data/sushruta-samhita/volume-4-chikitsasthana").scrape()

    # Sushruta Samhita, volume 5: Kalpasthana
    WisdomLibScraper("/hinduism/book/sushruta-samhita-volume-5-kalpasthana/d/doc142966.html",
                     "../data/sushruta-samhita/volume-5-kalpasthana").scrape()

    # Sushruta Samhita, volume 6: Uttara-Tantra
    WisdomLibScraper("/hinduism/book/sushruta-samhita-volume-6-uttara-tantra/d/doc142984.html",
                     "../data/sushruta-samhita/volume-6-uttara-tantra").scrape()
