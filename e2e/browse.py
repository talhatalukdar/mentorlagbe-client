"""Browse page: debounced server-side search, dropdown filters, mode chips and deep links."""
import time, os
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from helpers import driver, B
d=driver(1366,1000)
d.get(B+"/tuitions"); time.sleep(3.5)
n=lambda: len(d.find_elements(By.CSS_SELECTOR,"article"))
print("initial cards:", n())
box=d.find_element(By.CSS_SELECTOR,'input[aria-label="Search by title or subject"]')
box.send_keys("Physics"); time.sleep(2.5)
print("after typing 'Physics': cards", n(), "| url", d.current_url.split("localhost:3000")[1], "| input value:", box.get_attribute("value"))
titles=[a.text for a in d.find_elements(By.CSS_SELECTOR,"article h3")]; print("titles:", titles)
box.send_keys(Keys.CONTROL,"a"); box.send_keys(Keys.BACKSPACE); time.sleep(2.5); print("after clearing: cards", n())
# dropdown
d.find_element(By.CSS_SELECTOR,'button[aria-label="Subject"]').click(); time.sleep(0.8); pass
for o in d.find_elements(By.CSS_SELECTOR,'[role=option]'):
    if o.text.strip()=="Chemistry": o.click(); break
time.sleep(2.5); print("subject=Chemistry cards:", n(), "| url", d.current_url.split("localhost:3000")[1])
for b in d.find_elements(By.CSS_SELECTOR,'button[role=radio]'):
    if b.text=="Offline": b.click(); break
time.sleep(2.5); print("+Offline cards:", n(), "(expect 0 offline chemistry among seed? ->)", [a.text for a in d.find_elements(By.CSS_SELECTOR,"article h3")][:2])
d.get(B+"/tuitions?search=python"); time.sleep(3.5); print("hero-style deep link ?search=python: cards", n(), "input:", d.find_element(By.CSS_SELECTOR,'input[aria-label="Search by title or subject"]').get_attribute("value"))
d.set_window_size(1366,1100); d.get(B+"/tuitions"); time.sleep(3); pass
d.quit()
