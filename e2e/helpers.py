"""Headless-Firefox helpers for the e2e scripts. Needs: pip install selenium, Firefox + geckodriver.
Env: BASE_URL (default http://localhost:3000), FIREFOX_BIN, GECKODRIVER_BIN."""
import os, time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service

B = os.environ.get("BASE_URL", "http://localhost:3000")

def driver(w=1366, h=900):
    o = Options(); o.add_argument("-headless")
    if os.environ.get("FIREFOX_BIN"): o.binary_location = os.environ["FIREFOX_BIN"]
    svc = Service(os.environ["GECKODRIVER_BIN"]) if os.environ.get("GECKODRIVER_BIN") else Service()
    d = webdriver.Firefox(options=o, service=svc); d.set_window_size(w, h); return d
