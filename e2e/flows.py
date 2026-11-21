"""Click-through: apply, bookmark, cancel, review, tutor accept, admin approve.
Needs a seeded API and these env vars: E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_DEMO_PASSWORD (the SEED_DEMO_PASSWORD used by `npm run seed` on the server)."""
import time, os, json, urllib.request, secrets
from selenium.webdriver.common.by import By
from helpers import driver, B
ADMIN_EMAIL, ADMIN_PW, DEMO_PW = os.environ["E2E_ADMIN_EMAIL"], os.environ["E2E_ADMIN_PASSWORD"], os.environ["E2E_DEMO_PASSWORD"]
STUDENT_PW = "Pw!" + secrets.token_hex(8)
def post(path, body):
    r=urllib.request.Request(B+path, data=json.dumps(body).encode(), headers={"Content-Type":"application/json","Origin":B}); return urllib.request.urlopen(r).status
def login(d,email,pw):
    d.get(B+"/sign-in"); time.sleep(2.5)
    d.find_element(By.ID,"email").send_keys(email); d.find_element(By.ID,"password").send_keys(pw)
    d.find_element(By.CSS_SELECTOR,"form button[type=submit]").click(); time.sleep(4.5)
def toasts(d): return [e.text.replace("\n"," ") for e in d.find_elements(By.CSS_SELECTOR,"[data-sonner-toast]")]
def click_text(d, tag, text, exact=False):
    for e in d.find_elements(By.TAG_NAME, tag):
        t=e.text.strip()
        if (t==text if exact else text in t) and e.is_displayed():
            d.execute_script("arguments[0].scrollIntoView({block:'center'})", e); time.sleep(0.3); e.click(); return True
    return False
res=[]
def ok(name, cond, extra=""): res.append(cond); print(("PASS " if cond else "FAIL ")+name, extra if not cond else "")
ts=int(time.time()); email=f"ui.student.{ts}@test.local"
post("/api/auth/sign-up/email",{"name":"UI Student","email":email,"password":STUDENT_PW,"role":"student"})
d=driver(1366,1000)
login(d,email,STUDENT_PW)
# --- apply
d.get(B+"/tuitions?search=Physics"); time.sleep(3.5)
click_text(d,"a","View Details"); time.sleep(3.5)
d.find_element(By.ID,"studentPhone").send_keys("01712345678")
d.find_element(By.ID,"preferredSchedule").send_keys("Evenings after 6 PM")
d.find_element(By.ID,"studentNote").send_keys("I want to improve my mechanics and numericals.")
click_text(d,"button","Apply now"); time.sleep(3)
ok("student applies via form", any("Application submitted" in t for t in toasts(d)) or "You have applied" in d.page_source, toasts(d))
ok("apply panel switches to 'You have applied'", "You have applied" in d.page_source)
# --- bookmark from details
b=d.find_element(By.CSS_SELECTOR,'button[aria-label="Save tuition"]'); d.execute_script("arguments[0].scrollIntoView({block:'center'})", b); time.sleep(0.4); b.click(); time.sleep(2.5)
ok("bookmark toast", any("Saved" in t for t in toasts(d)), toasts(d))
d.get(B+"/dashboard/student/saved-tuitions"); time.sleep(3.5)
ok("saved page lists tuition", len(d.find_elements(By.CSS_SELECTOR,"article"))==1)
b=d.find_element(By.CSS_SELECTOR,'button[aria-label="Remove from saved tuitions"]'); d.execute_script("arguments[0].scrollIntoView({block:'center'})", b); time.sleep(0.4); b.click(); time.sleep(2.5)
d.get(B+"/dashboard/student/saved-tuitions"); time.sleep(3.5)
ok("bookmark removed", len(d.find_elements(By.CSS_SELECTOR,"article"))==0)
# --- cancel application
d.get(B+"/dashboard/student/my-applications"); time.sleep(3.5)
ok("application listed as pending", "pending" in d.page_source.lower())
click_text(d,"button","Cancel",exact=False); time.sleep(1)
click_text(d,"button","Cancel application"); time.sleep(3)
d.get(B+"/dashboard/student/my-applications"); time.sleep(3.5)
ok("application cancelled", "No applications yet" in d.page_source)
pass
d.quit()
# --- review (arif has an accepted application on HSC Physics)
d=driver(1366,1000); login(d,"arif.chowdhury@demo.mentorlagbe.example",DEMO_PW)
d.get(B+"/tuitions?search=HSC%20Physics"); time.sleep(3.5); click_text(d,"a","View Details"); time.sleep(4)
if d.find_elements(By.CSS_SELECTOR,'[role=radio][aria-label="4 stars"]'):
    d.find_element(By.CSS_SELECTOR,'[role=radio][aria-label="4 stars"]').click()
    d.find_element(By.CSS_SELECTOR,'textarea[aria-label="Review feedback"]').send_keys("Clear explanations and great practice problems.")
    click_text(d,"button","Submit review"); time.sleep(3)
    ok("accepted student reviews", any("Review submitted" in t for t in toasts(d)) or "Clear explanations" in d.page_source, toasts(d))
else:
    ok("review form visible for accepted student", False, "form not found (maybe already reviewed)"); ok("review shown", "Clear explanations" in d.page_source)
d.quit()
# --- tutor accepts a pending applicant
d=driver(1366,1000); login(d,"rafiq.ahmed@demo.mentorlagbe.example",DEMO_PW)
d.get(B+"/dashboard/tutor/applicants"); time.sleep(4)
before=d.page_source.count("accepted")
btns=[b for b in d.find_elements(By.TAG_NAME,"button") if b.text.strip()=="Accept" and b.is_enabled()]
if btns:
    btns[0].click(); time.sleep(3); ok("tutor accepts applicant", any("accepted" in t.lower() for t in toasts(d)), toasts(d))
else: ok("tutor has a pending applicant to accept", False, "none left (already accepted in earlier run)")
d.quit()
# --- admin approves a pending tuition
d=driver(1366,1000); login(d,ADMIN_EMAIL,ADMIN_PW)
d.get(B+"/dashboard/admin/tuitions"); time.sleep(4)
btns=[b for b in d.find_elements(By.TAG_NAME,"button") if b.text.strip()=="Approve" and b.is_enabled()]
if btns:
    btns[0].click(); time.sleep(3); ok("admin approves tuition", any("approved" in t.lower() for t in toasts(d)), toasts(d))
else: ok("admin has a pending tuition", False, "none pending")
pass; d.quit()
print(f"\n{sum(res)}/{len(res)} UI checks passed")
